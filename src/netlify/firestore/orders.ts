import admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';

import type { OrderStatus } from '~/netlify/types';
import { getOrderDocumentRef } from './document-references';

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

interface CreateOrderOptions {
  //
}

export const createOrder = async (options: CreateOrderOptions) => {
  const firestore = admin.firestore();

  const orderId = uuidv4();
  const now = Timestamp.now();

  await firestore.runTransaction(async tx => {
    const orderRef = getOrderDocumentRef(orderId, firestore);
  });
};
