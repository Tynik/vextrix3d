import { Timestamp } from 'firebase-admin/firestore';

import { createHandler } from '../utils';
import { withSession } from '../auth';
import { getQuotesCollection } from '../firestore';
import type { Quote } from '../types';

export type GetQuotesPayload = {
  limit?: number;
  cursor?: number;
};

export const handler = createHandler(
  {
    allowedMethods: ['GET'],
  },
  withSession<GetQuotesPayload>(async ({ decodedIdToken, payload }) => {
    const limit = Math.min(payload?.limit ?? 20, 50);

    let quotesQuery = getQuotesCollection()
      .where('requester.userId', '==', decodedIdToken.uid)
      .orderBy('createdAt', 'desc')
      .limit(limit + 1);

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
        pricing:
          quote.status === 'sent' || quote.status === 'accepted' || quote.status === 'expired'
            ? {
                amount: pricing.amount,
                discount: pricing.discount,
                vat: pricing.vat,
                total: pricing.total,
              }
            : null,
        pricedAt: quote.pricedAt?.toMillis() ?? null,
        sentAt: quote.sentAt?.toMillis() ?? null,
        acceptedAt: quote.acceptedAt?.toMillis() ?? null,
        rejectedAt: quote.rejectedAt?.toMillis() ?? null,
        expiredAt: quote.expiredAt?.toMillis() ?? null,
        updatedAt: quote.updatedAt.toMillis(),
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
