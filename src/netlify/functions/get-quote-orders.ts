import admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { assert } from '@react-hive/honey-utils';

import type { Order } from '../types';
import { createHandler } from '../utils';
import { withSession } from '../auth';
import { getOrdersCollectionRef, getQuoteDocRef } from '../firestore';

export type GetQuoteOrdersPayload = {
  quoteId: string;
  limit?: number;
  cursor?: number;
};

export const handler = createHandler(
  {
    allowedMethods: ['GET'],
  },
  withSession<GetQuoteOrdersPayload>(async ({ decodedIdToken, isAdmin, event }) => {
    const quoteId = event.queryStringParameters?.quoteId;
    const limit = Math.min(+(event.queryStringParameters?.limit ?? 10), 50);
    const cursor = +(event.queryStringParameters?.cursor ?? 0);

    assert(quoteId, 'Quote ID is required');

    const firestore = admin.firestore();

    const quoteRef = getQuoteDocRef(quoteId);
    const quoteSnap = await quoteRef.get();

    assert(quoteSnap.exists, 'Quote not found');

    const quote = quoteSnap.data();
    assert(quote, 'Quote data is empty');

    const isQuoteOwner = quote.requester.userId === decodedIdToken.uid;

    assert(isAdmin || isQuoteOwner, 'Forbidden');

    let query = getOrdersCollectionRef(firestore)
      .where('quoteId', '==', quoteId)
      .orderBy('createdAt', 'desc')
      .limit(limit + 1);

    if (cursor) {
      query = query.startAfter(Timestamp.fromMillis(cursor));
    }

    const snap = await query.get();

    const hasNextPage = snap.docs.length > limit;
    const docs = snap.docs.slice(0, limit);

    const data = docs.map<Order>(doc => {
      const order = doc.data();

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        status: order.status,
        job: {
          technology: order.job.technology,
          material: order.job.material,
          color: order.job.color,
          quantity: order.job.quantity,
          notes: order.job.notes,
        },
        pricing: {
          amount: order.pricing.amount,
          discountPct: order.pricing.discountPct,
          discountAmount: order.pricing.discountAmount,
          vatPct: order.pricing.vatPct,
          vatAmount: order.pricing.vatAmount,
          total: order.pricing.total,
        },
        payment: order.payment
          ? {
              paymentIntentId: order.payment.paymentIntentId,
              paidAt: order.payment.paidAt?.toMillis() ?? null,
              refundedAt: order.payment.refundedAt?.toMillis() ?? null,
            }
          : null,
        createdAt: order.createdAt.toMillis(),
      };
    });

    const nextCursor = hasNextPage ? data[data.length - 1].createdAt : null;

    return {
      status: 'ok',
      data: {
        data,
        limit,
        hasNextPage,
        nextCursor,
      },
    };
  }),
);
