import admin from 'firebase-admin';
import { assert } from '@react-hive/honey-utils';

import type { QuoteId } from '../types';
import { createHandler } from '../utils';
import { withSession } from '../auth';
import { changeQuoteStatusTx, getQuoteOrThrowTx } from '../firestore';

export type RejectQuotePayload = {
  quoteId: QuoteId;
  reason?: string;
};

export const handler = createHandler(
  {
    allowedMethods: ['POST'],
  },
  withSession<RejectQuotePayload>(async ({ decodedIdToken, isAdmin, payload }) => {
    const quoteId = payload?.quoteId;
    assert(quoteId, 'Quote ID is missing');

    const firestore = admin.firestore();

    await firestore.runTransaction(async tx => {
      const { quote } = await getQuoteOrThrowTx(tx, quoteId, firestore);

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

    return {
      status: 'ok',
      data: {},
    };
  }),
);
