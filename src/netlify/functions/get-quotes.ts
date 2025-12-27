import { Timestamp } from 'firebase-admin/firestore';

import type { Quote } from '../types';
import { createHandler } from '../utils';
import { withSession } from '../auth';
import { getQuotesCollectionRef, QUOTE_PRICING_ALLOWED_STATUSES } from '../firestore';

export type GetQuotesPayload = {
  limit?: number;
  cursor?: number;
};

export const handler = createHandler(
  {
    allowedMethods: ['GET'],
  },
  withSession<GetQuotesPayload>(async ({ decodedIdToken, isAdmin, event }) => {
    const limit = Math.min(+(event.queryStringParameters?.limit ?? 20), 50);
    const cursor = +(event.queryStringParameters?.cursor ?? 0);

    let quotesQuery = getQuotesCollectionRef()
      .orderBy('createdAt', 'desc')
      .limit(limit + 1);

    if (!isAdmin) {
      quotesQuery = quotesQuery.where('requester.userId', '==', decodedIdToken.uid);
    }

    if (cursor) {
      quotesQuery = quotesQuery.startAfter(Timestamp.fromMillis(cursor));
    }

    const quotesSnapshot = await quotesQuery.get();

    const hasNextPage = quotesSnapshot.docs.length > limit;
    const quoteDocs = quotesSnapshot.docs.slice(0, limit);

    const data = quoteDocs.map<Quote>(doc => {
      const quote = doc.data();

      const { requester, job, model, pricing } = quote;

      const isExposePricing = isAdmin || QUOTE_PRICING_ALLOWED_STATUSES.includes(quote.status);

      return {
        id: quote.id,
        quoteNumber: quote.quoteNumber,
        status: quote.status,
        requester,
        job: {
          technology: job.technology,
          material: job.material,
          color: job.color,
          quantity: job.quantity,
          description: job.description,
        },
        model: {
          originalFileName: model.originalFileName,
        },
        pricing: isExposePricing
          ? {
              amount: pricing.amount,
              discountPct: pricing.discountPct,
              discountAmount: pricing.discountAmount,
              vatPct: pricing.vatPct,
              vatAmount: pricing.vatAmount,
              total: pricing.total,
            }
          : null,
        pricedAt: quote.pricedAt?.toMillis() ?? null,
        acceptedAt: quote.acceptedAt?.toMillis() ?? null,
        rejectedAt: quote.rejectedAt?.toMillis() ?? null,
        expiredAt: quote.expiredAt?.toMillis() ?? null,
        updatedAt: quote.updatedAt?.toMillis() ?? null,
        createdAt: quote.createdAt.toMillis(),
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
