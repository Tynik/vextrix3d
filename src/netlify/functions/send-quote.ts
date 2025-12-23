import admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { assert } from '@react-hive/honey-utils';

import type { Nullable } from '~/types';
import { formatCurrency, buildQuotePricingValues } from '~/shared';
import type { QuoteId } from '../types';
import { createHandler, sendEmail } from '../utils';
import { withSession } from '../auth';
import { changeQuoteStatusTx, getQuoteDocRef, getUserDocRef } from '../firestore';

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

    let userInfo: Nullable<{
      firstName: string;
      lastName: string;
      email: string;
    }> = null;

    if (quote.requester.guest) {
      userInfo = {
        firstName: quote.requester.guest.firstName,
        lastName: quote.requester.guest.lastName,
        email: quote.requester.guest.email,
      };
    } else if (quote.requester.userId) {
      const userRef = await getUserDocRef(quote.requester.userId).get();
      if (userRef.exists) {
        const user = userRef.data();

        if (user) {
          userInfo = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          };
        }
      }
    }

    if (userInfo) {
      await sendEmail('send-quote', {
        from: 'Vextrix3D <no-reply@vextrix3d.co.uk>',
        to: userInfo.email,
        subject: `Your quote ${quote.quoteNumber} is ready`,
        parameters: {
          customerName: userInfo.firstName,
          quoteNumber: quote.quoteNumber,
          amount: formatCurrency(amount),
          discount: discountAmount ? formatCurrency(discountAmount) : undefined,
          vat: vatAmount ? formatCurrency(vatAmount) : undefined,
          total: formatCurrency(total),
          quoteUrl: 'https://vextrix3d.co.uk/account/quotes',
          note: note ?? undefined,
        },
      });
    }

    return {
      status: 'ok',
      data: {},
    };
  }),
);
