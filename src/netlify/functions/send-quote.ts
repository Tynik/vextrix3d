import admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { assert } from '@react-hive/honey-utils';

import type { Nullable } from '~/types';
import type { QuoteId } from '~/netlify/types';
import { createHandler } from '~/netlify/utils';
import { withSession } from '~/netlify/auth';
import { sendQuotePricedEmail } from '~/netlify/emails';
import { buildQuotePricingValues } from '~/shared';
import { changeQuoteStatusTx, getQuoteDocRef } from '../firestore';

export interface SendQuotePayload {
  quoteId: QuoteId;
  pricing: {
    amount: number;
    discountPct: Nullable<number>;
    vatPct: Nullable<number>;
  };
  note: Nullable<string>;
}

export const handler = createHandler(
  {
    allowedMethods: ['POST'],
  },
  withSession<SendQuotePayload>(async ({ decodedIdToken, isAdmin, payload }) => {
    assert(isAdmin, 'Forbidden');

    assert(payload?.quoteId, 'Quote ID is missing');
    assert(payload?.pricing, 'Pricing is missing');

    const { quoteId, pricing, note = null } = payload;

    const firestore = admin.firestore();

    const quoteRef = getQuoteDocRef(quoteId);
    const quoteSnap = await quoteRef.get();

    assert(quoteSnap.exists, 'Quote not found');

    const quote = quoteSnap.data();
    assert(quote, 'Quote data is empty');

    const { amount, discountPct, discountAmount, vatPct, vatAmount, total } =
      buildQuotePricingValues({
        amount: pricing.amount,
        discountPct: pricing.discountPct,
        vatPct: pricing.vatPct,
      });

    await firestore.runTransaction(async tx => {
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

      await changeQuoteStatusTx(tx, quote, 'priced', {
        id: decodedIdToken.uid,
        role: 'admin',
      });
    });

    await sendQuotePricedEmail(quote, {
      amount,
      discountAmount,
      vatAmount,
      total,
      note,
    });

    return {
      status: 'ok',
      data: {},
    };
  }),
);
