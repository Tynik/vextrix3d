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

    const quoteRef = getQuoteDocRef(quoteId);

    const quoteSnap = await quoteRef.get();
    assert(quoteSnap.exists, 'Quote does not exist');

    const quote = quoteSnap.data();
    assert(quote, 'Quote document data is empty');

    const isQuoteOwner = quote.requester.userId === decodedIdToken.uid;

    assert(isAdmin || isQuoteOwner, 'Forbidden');

    let query = getOrdersCollectionRef()
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

      const { customer, job, pricing } = order;

      return {
        id: order.id,
        quoteId: order.quoteId,
        customer: {
          userId: customer.userId,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
        },
        orderNumber: order.orderNumber,
        status: order.status,
        job: {
          technology: job.technology,
          material: job.material,
          color: job.color,
          quantity: job.quantity,
          description: job.description,
        },
        pricing: {
          amount: pricing.amount,
          discountPct: pricing.discountPct,
          discountAmount: pricing.discountAmount,
          vatPct: pricing.vatPct,
          vatAmount: pricing.vatAmount,
          total: pricing.total,
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
