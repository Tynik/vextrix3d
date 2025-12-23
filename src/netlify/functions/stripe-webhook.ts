import Stripe from 'stripe';
import admin from 'firebase-admin';
import type { Handler } from '@netlify/functions';
import { assert } from '@react-hive/honey-utils';

import { STRIPE_WEBHOOK_SECRET } from '../constants';
import { initFirebaseAdminApp } from '../firebase';
import { initStripeClient } from '../stripe';
import {
  processOrderPaymentCanceled,
  processOrderPaymentFailed,
  processOrderPaymentRefunded,
  processOrderPaymentSucceeded,
} from '../firestore';

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
        await processOrderPaymentSucceeded(firestore, stripeEvent.data.object);
        break;
      }

      case 'payment_intent.payment_failed': {
        await processOrderPaymentFailed(firestore, stripeEvent.data.object);
        break;
      }

      case 'payment_intent.canceled': {
        await processOrderPaymentCanceled(firestore, stripeEvent.data.object);
        break;
      }

      case 'charge.refunded': {
        await processOrderPaymentRefunded(firestore, stripeEvent.data.object);
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
