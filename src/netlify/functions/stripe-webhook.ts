import Stripe from 'stripe';
import admin from 'firebase-admin';
import { Firestore, Timestamp } from 'firebase-admin/firestore';
import type { Handler } from '@netlify/functions';
import { assert } from '@react-hive/honey-utils';

import { STRIPE_WEBHOOK_SECRET } from '../constants';
import { initFirebaseAdminApp } from '../firebase';
import { initStripeClient } from '../stripe';
import { getOrdersCollectionRef } from '../firestore';

const handlePaymentSucceeded = async (
  firestore: Firestore,
  paymentIntent: Stripe.PaymentIntent,
) => {
  const orderId = paymentIntent.metadata.orderId;
  assert(orderId, 'Missing orderId in PaymentIntent metadata');

  const orderRef = getOrdersCollectionRef().doc(orderId);

  await firestore.runTransaction(async tx => {
    const snap = await tx.get(orderRef);
    if (!snap.exists) {
      return;
    }

    const order = snap.data();
    if (!order || order.status !== 'new') {
      return;
    }

    tx.update(orderRef, {
      status: 'paid',
      payment: {
        paymentIntentId: paymentIntent.id,
        paidAt: Timestamp.now(),
        refundedAt: null,
      },
      updatedAt: Timestamp.now(),
    });
  });
};

const handleRefunded = async (firestore: Firestore, charge: Stripe.Charge) => {
  const paymentIntentId = charge.payment_intent as string;
  if (!paymentIntentId) {
    return;
  }

  const ordersQuery = await getOrdersCollectionRef()
    .where('payment.paymentIntentId', '==', paymentIntentId)
    .limit(1)
    .get();

  if (ordersQuery.empty) {
    return;
  }

  const orderRef = ordersQuery.docs[0].ref;

  await firestore.runTransaction(async tx => {
    const snap = await tx.get(orderRef);
    if (!snap.exists) {
      return;
    }

    const order = snap.data();
    if (!order || order.status === 'refunded') {
      return;
    }

    tx.update(orderRef, {
      status: 'refunded',
      'payment.refundedAt': Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  });
};

export const handler: Handler = async event => {
  assert(STRIPE_WEBHOOK_SECRET, 'STRIPE_WEBHOOK_SECRET is missing');

  const stripeSignature = event.headers['stripe-signature'];
  assert(stripeSignature, 'Stripe signature is missing');

  if (!event.body) {
    return {
      statusCode: 400,
      body: 'Missing body',
    };
  }

  const stripe = initStripeClient();

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      stripeSignature,
      STRIPE_WEBHOOK_SECRET,
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed', err.message);

    return {
      statusCode: 400,
      body: 'Invalid signature',
    };
  }

  await initFirebaseAdminApp();

  const firestore = admin.firestore();

  try {
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded': {
        const intent = stripeEvent.data.object as Stripe.PaymentIntent;

        await handlePaymentSucceeded(firestore, intent);
        break;
      }

      case 'charge.refunded': {
        const charge = stripeEvent.data.object as Stripe.Charge;

        await handleRefunded(firestore, charge);
        break;
      }

      default:
        // Ignore unsupported events
        break;
    }

    return {
      statusCode: 200,
      body: 'ok',
    };
  } catch (err) {
    console.error('Webhook handling failed', err);

    return {
      statusCode: 500,
      body: 'Webhook error',
    };
  }
};
