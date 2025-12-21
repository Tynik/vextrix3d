import admin from 'firebase-admin';
import { Transaction, Timestamp } from 'firebase-admin/firestore';
import { assert } from '@react-hive/honey-utils';

import type { Nullable } from '~/types';
import type { QuoteId, QuoteStatus, UserId } from '../types';
import type {
  Actor,
  QuoteDocument,
  QuoteJob,
  QuoteModel,
  QuotePricing,
  QuoteRequester,
  UserDocument,
} from './document-types';
import { getQuoteDocRef } from './document-references';
import { getNextSequence } from './utils';
import {
  getQuoteHistoryCollectionRef,
  getQuotesCollectionRef,
  QUOTES_COLLECTION_NAME,
} from './collections';

const ALLOWED_QUOTE_STATUS_TRANSITIONS: Record<QuoteStatus, QuoteStatus[]> = {
  new: ['quoted', 'rejected'],
  quoted: ['changeRequested', 'accepted', 'rejected', 'expired'],
  changeRequested: ['quoted', 'rejected'],
  accepted: ['changeRequested', 'inProduction'],
  rejected: [],
  expired: [],
  inProduction: ['completed'],
  completed: [],
};

export const QUOTE_PRICING_ALLOWED_STATUSES: QuoteStatus[] = [
  'quoted',
  'accepted',
  'rejected',
  'expired',
  'inProduction',
  'completed',
];

export const getExistingQuoteDocument = async (quoteId: QuoteId): Promise<QuoteDocument> => {
  const docRef = getQuoteDocRef(quoteId);

  const docSnap = await docRef.get();
  assert(docSnap.exists, 'Quote document does not exist');

  const quoteDoc = docSnap.data();
  assert(quoteDoc, 'Quote document data is empty');

  return quoteDoc;
};

const getNextQuoteNumber = async () => {
  const seq = await getNextSequence(QUOTES_COLLECTION_NAME);

  return `Q-${seq}`;
};

interface CreateQuoteOptions {
  requester: QuoteRequester;
  by: Actor;
  job: QuoteJob;
  model: QuoteModel;
  pricing: QuotePricing;
}

export const createQuote = async ({ requester, by, job, model, pricing }: CreateQuoteOptions) => {
  const firestore = admin.firestore();

  await firestore.runTransaction(async tx => {
    const quotesCollRef = getQuotesCollectionRef(firestore);
    const quoteDocRef = quotesCollRef.doc();

    const quoteNumber = await getNextQuoteNumber();
    const now = Timestamp.now();

    tx.set(quoteDocRef, {
      id: quoteDocRef.id,
      quoteNumber,
      status: 'new',
      requester,
      job,
      model,
      pricing,
      quotedAt: null,
      acceptedAt: null,
      rejectedAt: null,
      inProductionAt: null,
      completedAt: null,
      expiredAt: null,
      updatedAt: null,
      createdAt: now,
    });

    const quoteHistoryCollRef = getQuoteHistoryCollectionRef(quoteDocRef);
    const quoteHistoryDocRef = quoteHistoryCollRef.doc();

    tx.set(quoteHistoryDocRef, {
      id: quoteHistoryDocRef.id,
      type: 'statusChange',
      by,
      from: 'new',
      to: 'new',
      reason: null,
      createdAt: now,
    });
  });
};

interface ChangeQuoteStatusOptions {
  reason?: Nullable<string>;
}

export const changeQuoteStatusTx = async (
  tx: Transaction,
  quote: QuoteDocument,
  toStatus: QuoteStatus,
  by: Actor,
  { reason = null }: ChangeQuoteStatusOptions = {},
) => {
  const firestore = admin.firestore();
  const quoteDocRef = getQuoteDocRef(quote.id, firestore);

  assert(
    ALLOWED_QUOTE_STATUS_TRANSITIONS[quote.status].includes(toStatus),
    `Illegal status transition: ${quote.status} → ${toStatus}`,
  );

  const now = Timestamp.now();
  const quoteStatusUpdate: Partial<QuoteDocument> = {
    status: toStatus,
    updatedAt: now,
  };

  if (toStatus === 'quoted') {
    quoteStatusUpdate.quotedAt = now;
  }
  if (toStatus === 'accepted') {
    quoteStatusUpdate.acceptedAt = now;
  }
  if (toStatus === 'inProduction') {
    quoteStatusUpdate.inProductionAt = now;
  }
  if (toStatus === 'rejected') {
    quoteStatusUpdate.rejectedAt = now;
  }
  if (toStatus === 'expired') {
    quoteStatusUpdate.expiredAt = now;
  }
  if (toStatus === 'completed') {
    quoteStatusUpdate.completedAt = now;
  }

  tx.update(quoteDocRef, quoteStatusUpdate);

  const quoteHistoryCollRef = getQuoteHistoryCollectionRef(quoteDocRef);
  const quoteHistoryDocRef = quoteHistoryCollRef.doc();

  tx.set(quoteHistoryDocRef, {
    id: quoteHistoryDocRef.id,
    type: 'statusChange',
    by,
    from: quote.status,
    to: toStatus,
    reason,
    createdAt: now,
  });
};

export const buildQuoteHistoryActor = (user: Nullable<UserDocument>): Actor => {
  if (!user) {
    return {
      role: 'customer',
      id: null,
    };
  }

  return {
    role: user.role,
    id: user.id,
  };
};
