import admin from 'firebase-admin';
import { assert } from '@react-hive/honey-utils';

import type { QuoteId } from '~/netlify/types';
import { createHandler } from '../utils';
import { withSession } from '../auth';
import {
  getExistingUserDocument,
  getOrdersCollectionRef,
  changeQuoteStatusTx,
  buildQuoteHistoryActor,
  createOrder,
  getQuoteOrThrowTx,
} from '../firestore';

export interface AcceptQuotePayload {
  quoteId: QuoteId;
}

export const handler = createHandler(
  {
    allowedMethods: ['POST'],
  },
  withSession<AcceptQuotePayload>(async ({ decodedIdToken, payload }) => {
    const quoteId = payload?.quoteId;
    assert(quoteId, 'Quote ID is missing');

    const firestore = admin.firestore();

    try {
      const ordersRef = getOrdersCollectionRef(firestore);

      await firestore.runTransaction(async tx => {
        const { quote } = await getQuoteOrThrowTx(tx, quoteId, firestore);

        const isQuoteOwner = quote.requester.userId === decodedIdToken.uid;
        assert(isQuoteOwner, 'Forbidden');

        assert(quote.status === 'priced', 'Quote is not eligible for order creation');

        const orderQuery = ordersRef.where('quoteId', '==', quoteId).limit(1);
        const orderQuerySnap = await tx.get(orderQuery);
        if (!orderQuerySnap.empty) {
          return;
        }

        const user = await getExistingUserDocument(decodedIdToken.uid);

        await createOrder(tx, {
          user,
          quote,
        });

        await changeQuoteStatusTx(tx, quote, 'accepted', buildQuoteHistoryActor(user));
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
