import admin from 'firebase-admin';
import { assert } from '@react-hive/honey-utils';

import type { QuoteId } from '../types';
import { createHandler } from '../utils';
import { withSession } from '../auth';
import { changeQuoteStatusTx, getQuoteDocRef } from '../firestore';

export type RejectQuotePayload = {
  quoteId: QuoteId;
  reason?: string;
};

export const handler = createHandler(
  {
    allowedMethods: ['POST'],
  },
  withSession<RejectQuotePayload>(async ({ decodedIdToken, isAdmin, payload }) => {
    assert(payload?.quoteId, 'Quote ID is missing');

    const firestore = admin.firestore();

    try {
      await firestore.runTransaction(async tx => {
        const quoteRef = getQuoteDocRef(payload.quoteId);
        const quoteSnap = await tx.get(quoteRef);

        assert(quoteSnap.exists, 'Quote does not exist');

        const quote = quoteSnap.data();
        assert(quote, 'Quote data is empty');

        const isQuoteOwner = quote.requester.userId === decodedIdToken.uid;
        assert(isAdmin || isQuoteOwner, 'Forbidden');

        await changeQuoteStatusTx(
          tx,
          quote,
          'rejected',
          {
            id: decodedIdToken.uid,
            role: isAdmin ? 'admin' : 'customer',
          },
          {
            reason: payload.reason,
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
