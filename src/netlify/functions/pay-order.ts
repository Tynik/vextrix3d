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
  withSession<PayOrderPayload>(async ({ decodedIdToken, payload }) => {
    const orderId = payload?.orderId;
    assert(orderId, 'Order ID is missing');

    const firestore = admin.firestore();
    const orderRef = getOrderDocRef(orderId, firestore);

    const orderSnap = await orderRef.get();
    assert(orderSnap.exists, 'Order does not exist');

    const order = orderSnap.data();
    assert(order, 'Order document data is empty');

    const isOrderOwner = order.customer.userId === decodedIdToken.uid;
    assert(isOrderOwner, 'Forbidden');

    assert(order.status === 'new', 'Order is not payable');

    const { customer } = order;

    const stripe = initStripeClient();

    let stripeCustomerId = customer.stripeCustomerId;
    if (!stripeCustomerId) {
      const existingStripeCustomer = await stripe.customers.search({
        query: `email:"${customer.email}"`,
        limit: 1,
      });

      const stripeCustomer = existingStripeCustomer.data.length
        ? existingStripeCustomer.data[0]
        : await stripe.customers.create(
            {
              email: customer.email,
              name: `${customer.firstName} ${customer.lastName}`,
              phone: customer.phone ?? undefined,
              metadata: {
                userId: customer.userId,
              },
            },
            {
              idempotencyKey: `create-customer:user:${customer.userId}`,
            },
          );

      stripeCustomerId = stripeCustomer.id;

      await orderRef.set(
        {
          customer: {
            stripeCustomerId,
          },
          updatedAt: Timestamp.now(),
        },
        {
          merge: true,
        },
      );
    }

    const paymentIntentId = order.payment?.paymentIntentId;
    let paymentIntent: Stripe.PaymentIntent;

    if (paymentIntentId) {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    } else {
      paymentIntent = await stripe.paymentIntents.create(
        {
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
        },
        {
          idempotencyKey: `create-payment-intent:order:${order.id}`,
        },
      );

      await orderRef.set(
        {
          payment: {
            paymentIntentId: paymentIntent.id,
            paidAt: null,
            refundedAt: null,
          },
          updatedAt: Timestamp.now(),
        },
        {
          merge: true,
        },
      );
    }

    return {
      status: 'ok',
      data: {
        clientSecret: paymentIntent.client_secret,
      },
    };
  }),
);
