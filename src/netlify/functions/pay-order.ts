import Stripe from 'stripe';
import admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { assert } from '@react-hive/honey-utils';

import { createHandler } from '../utils';
import { withSession } from '../auth';
import { initStripeClient } from '../stripe';
import { getOrderDocRef } from '../firestore';

export type PayOrderPayload = {
  orderId: string;
};

export const handler = createHandler(
  { allowedMethods: ['POST'] },
  withSession<PayOrderPayload>(async ({ decodedIdToken, isAdmin, payload }) => {
    assert(payload?.orderId, 'Order ID is required');

    const firestore = admin.firestore();
    const orderRef = getOrderDocRef(payload.orderId, firestore);

    const orderSnap = await orderRef.get();
    assert(orderSnap.exists, 'Order not found');

    const order = orderSnap.data();
    assert(order, 'Order data missing');

    const isOwner = order.customer.userId === decodedIdToken.uid;
    assert(isAdmin || isOwner, 'Forbidden');

    assert(order.status === 'new', 'Order is not payable');

    const stripe = initStripeClient();

    let stripeCustomerId = order.customer.stripeCustomerId;
    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: order.customer.email,
        name: `${order.customer.firstName} ${order.customer.lastName}`,
        phone: order.customer.phone ?? undefined,
        metadata: {
          userId: order.customer.userId,
        },
      });

      stripeCustomerId = stripeCustomer.id;

      await orderRef.update({
        'customer.stripeCustomerId': stripeCustomerId,
        updatedAt: Timestamp.now(),
      });
    }

    const paymentIntentId = order.payment?.paymentIntentId ?? null;
    let paymentIntent: Stripe.PaymentIntent;

    if (paymentIntentId) {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    } else {
      paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(order.pricing.total * 100),
        currency: order.pricing.currency,
        customer: stripeCustomerId,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
      });

      await orderRef.update({
        payment: {
          paymentIntentId: paymentIntent.id,
          paidAt: null,
          refundedAt: null,
        },
        updatedAt: Timestamp.now(),
      });
    }

    return {
      status: 'ok',
      data: {
        clientSecret: paymentIntent.client_secret,
      },
    };
  }),
);
