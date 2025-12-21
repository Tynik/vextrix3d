import admin from 'firebase-admin';
import { Timestamp, Transaction } from 'firebase-admin/firestore';
import { assert } from '@react-hive/honey-utils';

import type { OrderStatus } from '~/netlify/types';
import type { QuoteDocument, UserDocument } from './document-types';
import { getOrdersCollectionRef, ORDERS_COLLECTION_NAME } from './collections';
import { getNextSequence } from './utils';

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

  assert(user.firstName, 'First name is missing');
  assert(user.lastName, 'Last name is missing');

  const ordersRef = getOrdersCollectionRef(firestore);
  const orderDocRef = ordersRef.doc();

  const orderNumber = await getNextOrderNumber();
  const now = Timestamp.now();

  tx.set(orderDocRef, {
    id: orderDocRef.id,
    quoteId: quote.id,
    orderNumber,
    status: 'new',
    customer: {
      userId: quote.requester.userId,
      stripeCustomerId: '',
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
    },
    job: {
      technology: quote.job.technology,
      material: quote.job.material,
      color: quote.job.color,
      quantity: quote.job.quantity,
      notes: quote.job.notes,
    },
    pricing: {
      currency: quote.pricing.currency,
      amount: quote.pricing.amount,
      discount: quote.pricing.discountPct,
      vat: quote.pricing.vatPct,
      total: quote.pricing.total,
    },
    payment: null,
    shipping: null,
    updatedAt: null,
    createdAt: now,
  });
};
