import admin from 'firebase-admin';
import { assert } from '@react-hive/honey-utils';

import type { QuoteId } from '../types';
import { createHandler } from '../utils';
import { withSession } from '../auth';
import {
  getExistingUserDocument,
  getOrdersCollectionRef,
  getQuoteDocRef,
  changeQuoteStatusTx,
  buildQuoteHistoryActor,
  createOrder,
} from '../firestore';

export interface AcceptQuotePayload {
  quoteId: QuoteId;
}

export const handler = createHandler(
  {
    allowedMethods: ['POST'],
  },
  withSession<AcceptQuotePayload>(async ({ decodedIdToken, payload }) => {
    assert(payload?.quoteId, 'Quote ID is missing');

    const { quoteId } = payload;

    const firestore = admin.firestore();

    try {
      const quoteDocRef = getQuoteDocRef(quoteId, firestore);
      const ordersCollRef = getOrdersCollectionRef(firestore);

      await firestore.runTransaction(async tx => {
        const quoteDocSnap = await tx.get(quoteDocRef);
        assert(quoteDocSnap.exists, 'Quote does not exist');

        const quote = quoteDocSnap.data();
        assert(quote, 'Quote data is empty');

        const isOwner = quote.requester.userId === decodedIdToken.uid;
        assert(isOwner, 'Forbidden');

        assert(quote.status === 'quoted', 'Quote is not eligible for order creation');

        const existingOrderQuery = await tx.get(
          ordersCollRef.where('quoteId', '==', quoteId).limit(1),
        );

        if (!existingOrderQuery.empty) {
          return;
        }

        const user = await getExistingUserDocument(decodedIdToken.uid);

        await createOrder(tx, {
          user,
          quote,
        });

        await changeQuoteStatusTx(tx, quote, 'accepted', buildQuoteHistoryActor(user), {
          reason: 'Quote accepted by customer',
        });
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
