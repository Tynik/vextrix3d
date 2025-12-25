import { Timestamp, getFirestore } from 'firebase-admin/firestore';
import { assert } from '@react-hive/honey-utils';

import type { Nullable } from '~/types';
import type { QuoteId } from '~/netlify/types';
import { changeOrderStatusTx } from '~/netlify/firestore';
import { createHandler } from '~/netlify/utils';
import { withSession } from '~/netlify/auth';
import {
  changeQuoteStatusTx,
  getOrdersCollectionRef,
  getQuoteChangeRequestsCollectionRef,
  getQuoteOrThrowTx,
} from '~/netlify/firestore';

export interface CreateQuoteChangeRequestPayload {
  quoteId: QuoteId;
  fields: {
    quantity?: Nullable<number>;
    material?: Nullable<string>;
    description?: Nullable<string>;
  };
  message: Nullable<string>;
}

export const handler = createHandler(
  { allowedMethods: ['POST'] },
  withSession<CreateQuoteChangeRequestPayload>(async ({ decodedIdToken, payload }) => {
    const { quoteId, fields, message = null } = payload ?? {};
    assert(quoteId, 'Quote ID is missing');

    const firestore = getFirestore();

    await firestore.runTransaction(async tx => {
      const { quoteRef, quote } = await getQuoteOrThrowTx(tx, quoteId, firestore);

      assert(quote.requester.userId === decodedIdToken.uid, 'Forbidden');

      const ordersRef = getOrdersCollectionRef(firestore);
      const ordersQuery = ordersRef
        .where('quoteId', '==', quoteId)
        .where('status', '==', 'new')
        .limit(1);

      const ordersSnap = await tx.get(ordersQuery);

      if (!ordersSnap.empty) {
        const orderSnap = ordersSnap.docs[0];

        changeOrderStatusTx(tx, orderSnap.data(), 'cancelled');
      }

      const quoteChangeReqRef = getQuoteChangeRequestsCollectionRef(quoteRef).doc();
      const now = Timestamp.now();

      tx.create(quoteChangeReqRef, {
        id: quoteChangeReqRef.id,
        userId: decodedIdToken.uid,
        status: 'new',
        fields: fields
          ? {
              quantity: fields.quantity ?? null,
              material: fields.material ?? null,
              description: fields.description ?? null,
            }
          : null,
        message,
        acceptedAt: null,
        rejectedAt: null,
        createdAt: now,
      });

      await changeQuoteStatusTx(tx, quote, 'changeRequested', {
        id: decodedIdToken.uid,
        role: 'customer',
      });
    });

    return {
      status: 'ok',
      data: {},
    };
  }),
);
