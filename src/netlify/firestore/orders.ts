import Stripe from 'stripe';
import admin from 'firebase-admin';
import { Firestore, Timestamp, Transaction } from 'firebase-admin/firestore';
import { assert } from '@react-hive/honey-utils';

import type { Nullable } from '~/types';
import type { OrderId, OrderStatus } from '~/netlify/types';
import type { OrderDocument, QuoteDocument, UserDocument } from './document-types';
import { getNextSequence } from './utils';
import { getOrdersCollectionRef, ORDERS_COLLECTION_NAME } from './collections';
import { getOrderDocRef } from './document-references';

const ALLOWED_ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  new: ['paid', 'cancelled', 'expired'],
  paid: ['inProduction', 'refunded'],
  inProduction: ['shipped', 'completed'],
  shipped: ['completed'],
  completed: ['refunded'],
  cancelled: [],
  refunded: [],
  expired: [],
};

export const getOrderOrThrow = async (
  orderId: OrderId,
  firestore: Firestore = admin.firestore(),
) => {
  const orderRef = getOrderDocRef(orderId, firestore);

  const orderSnap = await orderRef.get();
  assert(orderSnap.exists, 'Order does not exist');

  const order = orderSnap.data();
  assert(order, 'Order document data is empty');

  return {
    orderRef,
    order,
  };
};

export const getOrderOrThrowTx = async (
  tx: Transaction,
  orderId: OrderId,
  firestore: Firestore = admin.firestore(),
) => {
  const orderRef = getOrderDocRef(orderId, firestore);

  const orderSnap = await tx.get(orderRef);
  assert(orderSnap.exists, 'Order does not exist');

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

  tx.create(orderRef, {
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
      description: job.description,
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

export const changeOrderStatusTx = (
  tx: Transaction,
  order: OrderDocument,
  toStatus: OrderStatus,
) => {
  assert(
    ALLOWED_ORDER_STATUS_TRANSITIONS[order.status].includes(toStatus),
    `Illegal order status transition: ${order.status} → ${toStatus}`,
  );

  const orderRef = getOrderDocRef(order.id);

  const now = Timestamp.now();
  const baseUpdate: Partial<OrderDocument> = {
    status: toStatus,
    updatedAt: now,
  };

  if (toStatus === 'paid') {
    tx.set(
      orderRef,
      {
        ...baseUpdate,
        payment: {
          paidAt: now,
        },
      },
      {
        merge: true,
      },
    );

    return;
  }

  if (toStatus === 'refunded') {
    tx.set(
      orderRef,
      {
        ...baseUpdate,
        payment: {
          refundedAt: now,
        },
      },
      {
        merge: true,
      },
    );

    return;
  }

  tx.update(orderRef, baseUpdate);
};

export const processOrderPaymentSucceeded = async (
  firestore: Firestore,
  paymentIntent: Stripe.PaymentIntent,
) => {
  const { orderId } = paymentIntent.metadata;
  assert(orderId, 'Missing order id in payment intent metadata');

  await firestore.runTransaction(async tx => {
    const { order } = await getOrderOrThrowTx(tx, orderId, firestore);

    assert(order.payment, 'Payment is missing in order document');
    assert(order.payment.paymentIntentId === paymentIntent.id, 'Invalid payment intent id');

    if (order.status !== 'new') {
      return;
    }

    changeOrderStatusTx(tx, order, 'paid');
  });
};

export const processOrderPaymentFailed = async (
  firestore: Firestore,
  paymentIntent: Stripe.PaymentIntent,
) => {
  const { orderId } = paymentIntent.metadata;
  assert(orderId, 'Missing order id in payment intent metadata');

  await firestore.runTransaction(async tx => {
    const { orderRef, order } = await getOrderOrThrowTx(tx, orderId, firestore);

    assert(order.payment, 'Payment is missing in order document');
    assert(order.payment.paymentIntentId === paymentIntent.id, 'Invalid payment intent id');

    if (order.status !== 'new') {
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
  const { orderId } = paymentIntent.metadata;
  assert(orderId, 'Missing order id in payment intent metadata');

  await firestore.runTransaction(async tx => {
    const { orderRef, order } = await getOrderOrThrowTx(tx, orderId, firestore);

    assert(order.payment, 'Payment is missing in order document');
    assert(order.payment.paymentIntentId === paymentIntent.id, 'Invalid payment intent id');

    if (order.status !== 'new') {
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
  assert(paymentIntentId, 'Missing payment intent id in charge');

  const orderId = charge.metadata?.orderId;
  assert(orderId, 'Missing order id in charge metadata');

  await firestore.runTransaction(async tx => {
    const { order } = await getOrderOrThrowTx(tx, orderId, firestore);

    assert(order.payment, 'Payment is missing in order document');
    assert(order.payment.paymentIntentId === paymentIntentId, 'Invalid payment intent id');

    changeOrderStatusTx(tx, order, 'refunded');
  });
};
