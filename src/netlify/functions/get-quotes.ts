import { Timestamp } from 'firebase-admin/firestore';

import type { Quote } from '../types';
import { createHandler } from '../utils';
import { withSession } from '../auth';
import { getQuotesCollection, QUOTE_PRICING_ALLOWED_STATUSES } from '../firestore';

export type GetQuotesPayload = {
  limit?: number;
  cursor?: number;
};

export const handler = createHandler(
  {
    allowedMethods: ['GET'],
  },
  withSession<GetQuotesPayload>(async ({ decodedIdToken, isAdmin, payload }) => {
    const limit = Math.min(payload?.limit ?? 20, 50);

    let quotesQuery = getQuotesCollection()
      .orderBy('createdAt', 'desc')
      .limit(limit + 1);

    if (!isAdmin) {
      quotesQuery = quotesQuery.where('requester.userId', '==', decodedIdToken.uid);
    }

    if (payload?.cursor) {
      quotesQuery = quotesQuery.startAfter(Timestamp.fromMillis(payload.cursor));
    }

    const quotesSnapshot = await quotesQuery.get();

    const hasNextPage = quotesSnapshot.docs.length > limit;
    const quoteDocuments = quotesSnapshot.docs.slice(0, limit);

    const data = quoteDocuments.map<Quote>(document => {
      const quote = document.data();

      const { job, model, pricing } = quote;

      return {
        id: quote.id,
        status: quote.status,
        job: {
          technology: job.technology,
          material: job.material,
          color: job.color,
          quantity: job.quantity,
          notes: job.notes,
        },
        model: {
          fileName: model.fileName,
        },
        pricing: QUOTE_PRICING_ALLOWED_STATUSES.includes(quote.status)
          ? {
              amount: pricing.amount,
              discount: pricing.discount,
              vat: pricing.vat,
              total: pricing.total,
            }
          : null,
        quotedAt: quote.quotedAt?.toMillis() ?? null,
        acceptedAt: quote.acceptedAt?.toMillis() ?? null,
        inProductionAt: quote.inProductionAt?.toMillis() ?? null,
        rejectedAt: quote.rejectedAt?.toMillis() ?? null,
        expiredAt: quote.expiredAt?.toMillis() ?? null,
        completedAt: quote.completedAt?.toMillis() ?? null,
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
