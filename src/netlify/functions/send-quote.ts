import admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { assert } from '@react-hive/honey-utils';

import type { Nullable } from '~/types';
import { buildQuotePricingValues } from '~/shared';
import type { QuoteId } from '../types';
import { createHandler } from '../utils';
import { withSession } from '../auth';
import { getQuoteDocRef, changeQuoteStatusTx } from '../firestore';

export interface SendQuotePayload {
  quoteId: QuoteId;
  pricing: {
    amount: number;
    discountPct: Nullable<number>;
    vatPct: Nullable<number>;
  };
  note?: Nullable<string>;
}

export const handler = createHandler(
  {
    allowedMethods: ['POST'],
  },
  withSession<SendQuotePayload>(async ({ decodedIdToken, payload }) => {
    assert(decodedIdToken.role === 'admin', 'Forbidden');
    assert(payload?.quoteId, 'Quote ID is missing');
    assert(payload?.pricing, 'Pricing is missing');

    const { quoteId, pricing, note = null } = payload;

    const firestore = admin.firestore();

    try {
      await firestore.runTransaction(async tx => {
        const quoteRef = getQuoteDocRef(quoteId);
        const quoteSnap = await tx.get(quoteRef);

        assert(quoteSnap.exists, 'Quote not found');

        const quote = quoteSnap.data();
        assert(quote, 'Quote data is empty');

        assert(
          quote.status === 'new' || quote.status === 'changeRequested',
          'Quote cannot be sent in its current status',
        );

        const { amount, discountPct, discountAmount, vatPct, vatAmount, total } =
          buildQuotePricingValues({
            amount: pricing.amount,
            discountPct: pricing.discountPct,
            vatPct: pricing.vatPct,
          });

        tx.set(
          quoteRef,
          {
            pricing: {
              type: 'final',
              currency: 'gbp',
              amount,
              discountPct,
              discountAmount,
              vatPct,
              vatAmount,
              total,
            },
            updatedAt: Timestamp.now(),
          },
          {
            merge: true,
          },
        );

        await changeQuoteStatusTx(
          tx,
          quote,
          'priced',
          {
            id: decodedIdToken.uid,
            role: 'admin',
          },
          {
            reason: note,
          },
        );
      });
    } catch (e: any) {
      console.error(e);

      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: {
            message: e.message,
          },
        },
      };
    }

    return {
      status: 'ok',
      data: {},
    };
  }),
);
