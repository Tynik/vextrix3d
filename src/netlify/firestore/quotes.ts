import admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { assert } from '@react-hive/honey-utils';
import { v4 as uuidv4 } from 'uuid';

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
import { getQuoteDocumentRef, getQuoteHistoryStatusChangeDocumentRef } from './document-references';

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
  const documentReference = getQuoteDocumentRef(quoteId);

  const documentSnapshot = await documentReference.get();
  assert(documentSnapshot.exists, 'Quote document does not exist');

  const quoteDocument = documentSnapshot.data();
  assert(quoteDocument, 'Quote document data is empty');

  return quoteDocument;
};

interface CreateQuoteOptions {
  requester: QuoteRequester;
  by: Actor;
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
  const firestore = admin.firestore();

  const quoteId = uuidv4();
  const now = Timestamp.now();

  await firestore.runTransaction(async tx => {
    const quoteRef = getQuoteDocumentRef(quoteId, firestore);

    tx.set(quoteRef, {
      id: quoteId,
      requester,
      status: 'new',
      job,
      model,
      pricing,
      quotedAt: null,
      acceptedAt: null,
      inProductionAt: null,
      rejectedAt: null,
      expiredAt: null,
      completedAt: null,
      updatedAt: null,
      createdAt: now,
    });

    const quoteHistoryRef = getQuoteHistoryStatusChangeDocumentRef(quoteId, uuidv4(), firestore);
    tx.set(quoteHistoryRef, {
      id: quoteHistoryRef.id,
      type: 'statusChange',
      by,
      from: 'new',
      to: 'new',
      reason: null,
      createdAt: now,
    });
  });

  return {
    quoteId,
  };
};

interface ChangeQuoteStatusOptions {
  quoteId: QuoteId;
  toStatus: QuoteStatus;
  by: Actor;
  reason?: string;
}

export const changeQuoteStatus = async ({
  quoteId,
  toStatus,
  by,
  reason,
}: ChangeQuoteStatusOptions) => {
  const firestore = admin.firestore();

  await firestore.runTransaction(async tx => {
    const quoteRef = getQuoteDocumentRef(quoteId, firestore);

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

    tx.update(quoteRef, quoteStatusUpdate);

    const quoteHistoryRef = getQuoteHistoryStatusChangeDocumentRef(quoteId, uuidv4(), firestore);
    tx.set(quoteHistoryRef, {
      id: quoteHistoryRef.id,
      type: 'statusChange',
      by,
      from: quoteDocument.status,
      to: toStatus,
      reason: reason ?? null,
      createdAt: now,
    });
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
