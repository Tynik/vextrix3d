import Stripe from 'stripe';
import admin from 'firebase-admin';
import { Firestore, Timestamp, Transaction } from 'firebase-admin/firestore';
import { assert } from '@react-hive/honey-utils';

import type { Nullable } from '~/types';
import type { OrderId, OrderStatus } from '~/netlify/types';
import type { OrderDocument, QuoteDocument, UserDocument } from './document-types';
import { getNextSequence } from './utils';
import { getOrdersCollectionRef, ORDERS_COLLECTION_NAME } from './collections';
import { getOrderRef } from './document-references';

const ALLOWED_ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  new: ['paid', 'cancelled', 'expired'],
  paid: ['inProduction', 'refunded'],
  inProduction: ['shipped', 'completed'],
  shipped: ['completed'],
  completed: [],
  cancelled: [],
  refunded: [],
  expired: [],
};

export const getOrderOrThrowTx = async (
  tx: Transaction,
  orderId: OrderId,
  firestore: Firestore = admin.firestore(),
) => {
  const orderRef = getOrderRef(orderId, firestore);

  const orderSnap = await tx.get(orderRef);
  assert(orderSnap.exists, 'Order document does not exist');

  const order = orderSnap.data();
  assert(order, 'Order document data is empty');

  return {
    orderRef,
    order,
  };
};

export const getNextOrderNumber = async () => {
  const seq = await getNextSequence(ORDERS_COLLECTION_NAME);

  return `OR-${seq}`;
};

interface CreateOrderOptions {
  user: UserDocument;
  quote: QuoteDocument;
}

export const createOrder = async (tx: Transaction, { user, quote }: CreateOrderOptions) => {
  const firestore = admin.firestore();

  const { job, pricing } = quote;

  assert(
    pricing.total && pricing.total > 0 && pricing.total <= 9999,
    'Total price is missing or invalid',
  );

  const orderRef = getOrdersCollectionRef(firestore).doc();

  const orderNumber = await getNextOrderNumber();
  const now = Timestamp.now();

  tx.set(orderRef, {
    id: orderRef.id,
    quoteId: quote.id,
    orderNumber,
    status: 'new',
    customer: {
      userId: quote.requester.userId,
      stripeCustomerId: null,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    },
    job: {
      technology: job.technology,
      material: job.material,
      color: job.color,
      quantity: job.quantity,
      notes: job.notes,
    },
    pricing: {
      currency: pricing.currency,
      amount: pricing.amount,
      discountPct: pricing.discountPct,
      discountAmount: pricing.discountAmount,
      vatPct: pricing.vatPct,
      vatAmount: pricing.vatAmount,
      total: pricing.total,
    },
    payment: null,
    shipping: null,
    updatedAt: null,
    createdAt: now,
  });
};

export const processOrderPaymentSucceeded = async (
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

    if (!order.payment || order.payment.paymentIntentId !== paymentIntent.id) {
      return;
    }

    const now = Timestamp.now();

    tx.set(
      orderRef,
      {
        status: 'paid',
        payment: {
          paidAt: now,
        },
        updatedAt: now,
      },
      {
        merge: true,
      },
    );
  });
};

export const processOrderPaymentFailed = async (
  firestore: Firestore,
  paymentIntent: Stripe.PaymentIntent,
) => {
  const { orderId } = paymentIntent.metadata;
  if (!orderId) {
    return;
  }

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

    if (!order.payment || order.payment.paymentIntentId !== paymentIntent.id) {
      return;
    }

    tx.update(orderRef, {
      payment: null,
      updatedAt: Timestamp.now(),
    } satisfies Partial<OrderDocument>);
  });
};

export const processOrderPaymentCanceled = async (
  firestore: Firestore,
  paymentIntent: Stripe.PaymentIntent,
) => {
  const orderId = paymentIntent.metadata.orderId;
  if (!orderId) {
    return;
  }

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

    if (!order.payment || order.payment.paymentIntentId !== paymentIntent.id) {
      return;
    }

    tx.update(orderRef, {
      payment: null,
      updatedAt: Timestamp.now(),
    } satisfies Partial<OrderDocument>);
  });
};

export const processOrderPaymentRefunded = async (firestore: Firestore, charge: Stripe.Charge) => {
  const paymentIntentId = charge.payment_intent as Nullable<string>;
  if (!paymentIntentId) {
    return;
  }

  const orderId = charge.metadata?.orderId;
  assert(orderId, 'Missing orderId in charge metadata');

  const orderRef = getOrderRef(orderId);

  await firestore.runTransaction(async tx => {
    const orderSnap = await tx.get(orderRef);
    if (!orderSnap.exists) {
      return;
    }

    const order = orderSnap.data();
    if (!order || order.status === 'refunded') {
      return;
    }

    if (!order.payment || order.payment.paymentIntentId !== paymentIntentId) {
      return;
    }

    const now = Timestamp.now();

    tx.set(
      orderRef,
      {
        status: 'refunded',
        payment: {
          refundedAt: now,
        },
        updatedAt: now,
      },
      {
        merge: true,
      },
    );
  });
};
