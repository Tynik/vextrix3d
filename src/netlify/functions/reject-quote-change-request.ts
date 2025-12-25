import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { assert } from '@react-hive/honey-utils';

import type { Nullable } from '~/types';
import type { QuoteChangeRequestId, QuoteId } from '~/netlify/types';
import { withSession } from '~/netlify/auth';
import { createHandler } from '~/netlify/utils';
import type { QuoteChangeRequestDocument } from '~/netlify/firestore';
import {
  getQuoteChangeRequestOrThrowTx,
  changeQuoteStatusTx,
  getQuoteOrThrowTx,
} from '~/netlify/firestore';

export interface RejectQuoteChangeRequestPayload {
  quoteId: QuoteId;
  changeRequestId: QuoteChangeRequestId;
  reason?: Nullable<string>;
}

export const handler = createHandler(
  { allowedMethods: ['POST'] },
  withSession<RejectQuoteChangeRequestPayload>(async ({ decodedIdToken, isAdmin, payload }) => {
    assert(isAdmin, 'Forbidden');

    const { quoteId, changeRequestId, reason = null } = payload ?? {};

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

      tx.update(quoteChangeReqRef, {
        status: 'rejected',
        message: reason,
        rejectedAt: now,
      } satisfies Partial<QuoteChangeRequestDocument>);

      await changeQuoteStatusTx(
        tx,
        quote,
        'priced',
        {
          id: decodedIdToken.uid,
          role: 'admin',
        },
        {
          reason,
        },
      );
    });

    return {
      status: 'ok',
      data: {},
    };
  }),
);
