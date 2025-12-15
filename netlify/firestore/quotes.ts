import admin from 'firebase-admin';
import type { DocumentReference } from 'firebase-admin/firestore';
import { Timestamp } from 'firebase-admin/firestore';
import { assert } from '@react-hive/honey-utils';
import { v4 as uuidv4 } from 'uuid';

import type { Nullable } from '../types';
import type {
  QuoteHistoryActor,
  QuoteDocument,
  QuoteHistoryStatusChangeDocument,
  QuoteId,
  QuoteJob,
  QuoteModel,
  QuotePricing,
  QuoteRequester,
  QuoteStatus,
  UserDocument,
} from './document-types';
import { getQuoteHistoryCollection, QUOTES_COLLECTION_NAME } from './collections';
import { quoteConverter } from './data-convertors';

export const getQuoteDocumentRef = (
  quoteId: QuoteId,
  firestore = admin.firestore(),
): DocumentReference<QuoteDocument> =>
  firestore.doc(`${QUOTES_COLLECTION_NAME}/${quoteId}`).withConverter(quoteConverter);

export const getExistingQuoteDocument = async (quoteId: QuoteId): Promise<QuoteDocument> => {
  const documentReference = getQuoteDocumentRef(quoteId);

  const documentSnapshot = await documentReference.get();
  assert(documentSnapshot.exists, 'Quote document does not exist');

  const quoteDocument = documentSnapshot.data();
  assert(quoteDocument, 'Quote document data is empty');

  return quoteDocument;
};

interface CreateQuoteOptions {
  requester: QuoteRequester;
  by: QuoteHistoryActor;
  job: QuoteJob;
  model: QuoteModel;
  pricing: QuotePricing;
}

export const createQuote = async ({
  requester,
  by,
  job,
  model,
  pricing,
}: CreateQuoteOptions): Promise<{
  quoteId: QuoteId;
}> => {
  const quoteId = uuidv4();
  const now = Timestamp.now();

  const quoteDocument: QuoteDocument = {
    id: quoteId,
    requester,
    status: 'new',
    job,
    model,
    pricing,
    pricedAt: null,
    sentAt: null,
    acceptedAt: null,
    rejectedAt: null,
    expiredAt: null,
    createdAt: now,
    updatedAt: now,
  };

  await admin.firestore().runTransaction(async tx => {
    const quoteRef = getQuoteDocumentRef(quoteId);
    tx.set(quoteRef, quoteDocument);

    const quoteHistoryRef = getQuoteHistoryCollection(quoteRef).doc();
    tx.set(quoteHistoryRef, {
      type: 'status-change',
      at: now,
      by,
      from: 'new',
      to: 'new',
      reason: null,
    });
  });

  return {
    quoteId,
  };
};

const ALLOWED_QUOTE_STATUS_TRANSITIONS: Record<QuoteStatus, QuoteStatus[]> = {
  new: ['priced', 'rejected'],
  priced: ['sent', 'rejected'],
  sent: ['accepted', 'rejected', 'expired'],
  accepted: [],
  rejected: [],
  expired: [],
};

interface ChangeQuoteStatusOptions {
  quoteId: QuoteId;
  toStatus: QuoteStatus;
  by: QuoteHistoryActor;
  reason?: string;
}

export const changeQuoteStatus = async ({
  quoteId,
  toStatus,
  by,
  reason,
}: ChangeQuoteStatusOptions) => {
  await admin.firestore().runTransaction(async tx => {
    const quoteRef = getQuoteDocumentRef(quoteId);

    const quoteDocumentSnapshot = await tx.get(quoteRef);
    assert(quoteDocumentSnapshot.exists, 'Quote does not exist');

    const quoteDocument = quoteDocumentSnapshot.data();
    assert(quoteDocument, 'Quote document data is empty');

    assert(
      ALLOWED_QUOTE_STATUS_TRANSITIONS[quoteDocument.status].includes(toStatus),
      `Illegal status transition: ${quoteDocument.status} → ${toStatus}`,
    );

    const now = Timestamp.now();

    const quoteStatusUpdate: Partial<QuoteDocument> = {
      status: toStatus,
      updatedAt: now,
    };

    if (toStatus === 'priced') {
      quoteStatusUpdate.pricedAt = now;
    }
    if (toStatus === 'sent') {
      quoteStatusUpdate.sentAt = now;
    }
    if (toStatus === 'accepted') {
      quoteStatusUpdate.acceptedAt = now;
    }
    if (toStatus === 'rejected') {
      quoteStatusUpdate.rejectedAt = now;
    }
    if (toStatus === 'expired') {
      quoteStatusUpdate.expiredAt = now;
    }

    tx.update(quoteRef, quoteStatusUpdate);

    const historyChange: QuoteHistoryStatusChangeDocument = {
      type: 'status-change',
      at: now,
      by,
      from: quoteDocument.status,
      to: toStatus,
      reason: reason ?? null,
    };

    const quoteHistoryRef = getQuoteHistoryCollection(quoteRef).doc();
    tx.set(quoteHistoryRef, historyChange);
  });
};

export const buildQuoteHistoryActor = (user: Nullable<UserDocument>): QuoteHistoryActor => {
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
