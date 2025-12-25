import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { assert } from '@react-hive/honey-utils';

import type { QuoteChangeRequestId, QuoteId } from '~/netlify/types';
import { withSession } from '~/netlify/auth';
import { createHandler } from '~/netlify/utils';
import type { QuoteChangeRequestDocument } from '~/netlify/firestore';
import {
  getQuoteChangeRequestOrThrowTx,
  changeQuoteStatusTx,
  getQuoteOrThrowTx,
} from '~/netlify/firestore';

export interface ApproveQuoteChangeRequestPayload {
  quoteId: QuoteId;
  changeRequestId: QuoteChangeRequestId;
}

export const handler = createHandler(
  { allowedMethods: ['POST'] },
  withSession<ApproveQuoteChangeRequestPayload>(async ({ decodedIdToken, isAdmin, payload }) => {
    assert(isAdmin, 'Forbidden');

    const { quoteId, changeRequestId } = payload ?? {};

    assert(quoteId, 'Quote ID is missing');
    assert(changeRequestId, 'Change request ID is missing');

    const firestore = getFirestore();

    await firestore.runTransaction(async tx => {
      const { quoteRef, quote } = await getQuoteOrThrowTx(tx, quoteId, firestore);
      assert(quote.status === 'changeRequested', 'Quote is not in change requested state');

      const { quoteChangeReqRef, quoteChangeReq } = await getQuoteChangeRequestOrThrowTx(
        tx,
        quoteRef,
        changeRequestId,
      );

      assert(quoteChangeReq.status === 'new', 'Quote change request already processed');

      const now = Timestamp.now();

      tx.set(
        quoteRef,
        {
          job: {
            quantity: quoteChangeReq.fields?.quantity ?? quote.job.quantity,
            material: quoteChangeReq.fields?.material ?? quote.job.material,
            description: quoteChangeReq.fields?.description ?? quote.job.description,
          },
          updatedAt: now,
        },
        {
          merge: true,
        },
      );

      tx.update(quoteChangeReqRef, {
        status: 'accepted',
        acceptedAt: now,
      } satisfies Partial<QuoteChangeRequestDocument>);

      await changeQuoteStatusTx(tx, quote, 'new', {
        id: decodedIdToken.uid,
        role: 'admin',
      });
    });

    return {
      status: 'ok',
      data: {},
    };
  }),
);
