import admin from 'firebase-admin';
import { Transaction, Timestamp, Firestore } from 'firebase-admin/firestore';
import { assert } from '@react-hive/honey-utils';

import type { Nullable } from '~/types';
import type { QuoteId, QuoteStatus } from '../types';
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
  new: ['priced', 'rejected'],
  priced: ['changeRequested', 'accepted', 'rejected', 'expired'],
  changeRequested: ['priced', 'rejected'],
  accepted: ['changeRequested', 'inProduction'],
  rejected: [],
  expired: [],
  inProduction: ['completed'],
  completed: [],
};

export const QUOTE_PRICING_ALLOWED_STATUSES: QuoteStatus[] = [
  'priced',
  'accepted',
  'rejected',
  'expired',
  'inProduction',
  'completed',
];

export const getQuoteOrThrowTx = async (
  tx: Transaction,
  quoteId: QuoteId,
  firestore: Firestore = admin.firestore(),
) => {
  const quoteRef = getQuoteDocRef(quoteId, firestore);

  const quoteSnap = await tx.get(quoteRef);
  assert(quoteSnap.exists, 'Quote document does not exist');

  const quote = quoteSnap.data();
  assert(quote, 'Quote document data is empty');

  return {
    quoteRef,
    quote,
  };
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
    const quoteRef = quotesCollRef.doc();

    const quoteNumber = await getNextQuoteNumber();
    const now = Timestamp.now();

    tx.set(quoteRef, {
      id: quoteRef.id,
      quoteNumber,
      status: 'new',
      requester,
      job,
      model,
      pricing,
      pricedAt: null,
      acceptedAt: null,
      rejectedAt: null,
      inProductionAt: null,
      completedAt: null,
      expiredAt: null,
      updatedAt: null,
      createdAt: now,
    });

    const quoteHistoryCollRef = getQuoteHistoryCollectionRef(quoteRef);
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
  const quoteRef = getQuoteDocRef(quote.id, firestore);

  assert(
    ALLOWED_QUOTE_STATUS_TRANSITIONS[quote.status].includes(toStatus),
    `Illegal status transition: ${quote.status} → ${toStatus}`,
  );

  const now = Timestamp.now();
  const quoteStatusUpdate: Partial<QuoteDocument> = {
    status: toStatus,
    updatedAt: now,
  };

  if (toStatus === 'priced') {
    quoteStatusUpdate.pricedAt = now;
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

  tx.update(quoteRef, quoteStatusUpdate);

  const quoteHistoryCollRef = getQuoteHistoryCollectionRef(quoteRef);
  const quoteHistoryRef = quoteHistoryCollRef.doc();

  tx.set(quoteHistoryRef, {
    id: quoteHistoryRef.id,
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
