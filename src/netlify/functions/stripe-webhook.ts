import Stripe from 'stripe';
import admin from 'firebase-admin';
import { Firestore, Timestamp } from 'firebase-admin/firestore';
import type { Handler } from '@netlify/functions';
import { assert } from '@react-hive/honey-utils';

import type { Nullable } from '~/types';
import { STRIPE_WEBHOOK_SECRET } from '../constants';
import { initFirebaseAdminApp } from '../firebase';
import { initStripeClient } from '../stripe';
import { getOrderPrivatePaymentRef, getOrderRef } from '../firestore';

const handlePaymentSucceeded = async (
  firestore: Firestore,
  paymentIntent: Stripe.PaymentIntent,
) => {
  const orderId = paymentIntent.metadata.orderId;
  assert(orderId, 'Missing orderId in PaymentIntent metadata');

  const orderRef = getOrderRef(orderId);

  await firestore.runTransaction(async tx => {
    const orderSnap = await tx.get(orderRef);
    if (!orderSnap.exists) {
      return;
    }

    const order = orderSnap.data();
    if (!order || order.status !== 'new') {
      return;
    }

    const now = Timestamp.now();

    tx.update(orderRef, {
      status: 'paid',
      payment: {
        paidAt: now,
      },
      updatedAt: now,
    });
  });
};

const handleRefunded = async (firestore: Firestore, charge: Stripe.Charge) => {
  const paymentIntentId = charge.payment_intent as Nullable<string>;
  if (!paymentIntentId) {
    return;
  }

  const orderId = charge.metadata?.orderId;
  assert(orderId, 'Missing orderId in charge metadata');

  const orderRef = getOrderRef(orderId);
  const privatePaymentRef = getOrderPrivatePaymentRef(orderId);

  await firestore.runTransaction(async tx => {
    const [orderSnap, privatePaymentSnap] = await Promise.all([
      tx.get(orderRef),
      tx.get(privatePaymentRef),
    ]);

    if (!orderSnap.exists) {
      return;
    }

    const order = orderSnap.data();
    if (!order || order.status === 'refunded') {
      return;
    }

    // Optional safety check
    if (
      privatePaymentSnap.exists &&
      privatePaymentSnap.data()?.paymentIntentId !== paymentIntentId
    ) {
      return;
    }

    const now = Timestamp.now();

    tx.update(orderRef, {
      status: 'refunded',
      'payment.refundedAt': now,
      updatedAt: now,
    });
  });
};

const handlePaymentCanceled = async (firestore: Firestore, intent: Stripe.PaymentIntent) => {
  const orderId = intent.metadata.orderId;
  if (!orderId) {
    return;
  }

  const orderRef = getOrderRef(orderId);
  const orderPrivatePaymentRef = getOrderPrivatePaymentRef(orderId);

  await firestore.runTransaction(async tx => {
    const orderSnap = await tx.get(orderRef);
    if (!orderSnap.exists) {
      return;
    }

    const order = orderSnap.data();
    if (!order) {
      return;
    }

    if (order.status !== 'new') {
      return;
    }

    tx.update(orderPrivatePaymentRef, {
      paymentIntentId: null,
    });

    tx.update(orderRef, {
      payment: {
        paidAt: null,
        refundedAt: null,
      },
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
        await handlePaymentSucceeded(firestore, stripeEvent.data.object);
        break;
      }

      case 'payment_intent.canceled': {
        await handlePaymentCanceled(firestore, stripeEvent.data.object);
        break;
      }

      case 'charge.refunded': {
        await handleRefunded(firestore, stripeEvent.data.object);
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
