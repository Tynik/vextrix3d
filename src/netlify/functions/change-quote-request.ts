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
    notes?: Nullable<string>;
  };
  message: Nullable<string>;
}

export const handler = createHandler(
  { allowedMethods: ['POST'] },
  withSession<CreateQuoteChangeRequestPayload>(async ({ decodedIdToken, payload }) => {
    const quoteId = payload?.quoteId;
    assert(quoteId, 'Quote ID is missing');

    const { fields } = payload;

    const firestore = getFirestore();

    await firestore.runTransaction(async tx => {
      const { quoteRef, quote } = await getQuoteOrThrowTx(tx, quoteId, firestore);

      assert(quote.requester.userId === decodedIdToken.uid, 'Forbidden');

      const quoteChangeReqRef = getQuoteChangeRequestsCollectionRef(quoteRef).doc();

      const ordersRef = getOrdersCollectionRef(firestore);
      const ordersQuery = ordersRef
        .where('quoteId', '==', quoteId)
        .where('status', '==', 'new')
        .limit(1);

      const ordersSnap = await tx.get(ordersQuery);

      if (!ordersSnap.empty) {
        const orderSnap = ordersSnap.docs[0];
        assert(orderSnap.exists, 'Order does not exist');

        changeOrderStatusTx(tx, orderSnap.data(), 'cancelled');
      }

      const now = Timestamp.now();

      tx.create(quoteChangeReqRef, {
        id: quoteChangeReqRef.id,
        userId: decodedIdToken.uid,
        status: 'new',
        fields: fields
          ? {
              quantity: fields.quantity ?? null,
              material: fields.material ?? null,
              notes: fields.notes ?? null,
            }
          : null,
        message: payload.message ?? null,
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
