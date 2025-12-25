import type { FirestoreDataConverter } from 'firebase-admin/firestore';

import type {
  SequenceDocument,
  OrderDocument,
  QuoteDocument,
  QuoteHistoryStatusChangeDocument,
  UserDocument,
  OrderPrivateDocument,
  QuoteChangeRequestDocument,
} from './document-types';

export const sequenceConverter: FirestoreDataConverter<SequenceDocument> = {
  toFirestore: data => data,
  fromFirestore: snapshot => snapshot.data() as SequenceDocument,
};

export const userConverter: FirestoreDataConverter<UserDocument> = {
  toFirestore: data => data,
  fromFirestore: snapshot => snapshot.data() as UserDocument,
};

export const quoteConverter: FirestoreDataConverter<QuoteDocument> = {
  toFirestore: data => data,
  fromFirestore: snapshot => snapshot.data() as QuoteDocument,
};

export const quoteHistoryStatusChangeConverter: FirestoreDataConverter<QuoteHistoryStatusChangeDocument> =
  {
    toFirestore: data => data,
    fromFirestore: snapshot => snapshot.data() as QuoteHistoryStatusChangeDocument,
  };

export const quoteChangeRequestConverter: FirestoreDataConverter<QuoteChangeRequestDocument> = {
  toFirestore: data => data,
  fromFirestore: snapshot => snapshot.data() as QuoteChangeRequestDocument,
};

export const orderConverter: FirestoreDataConverter<OrderDocument> = {
  toFirestore: data => data,
  fromFirestore: snapshot => snapshot.data() as OrderDocument,
};

export const orderPrivateConverter: FirestoreDataConverter<OrderPrivateDocument> = {
  toFirestore: data => data,
  fromFirestore: snapshot => snapshot.data() as OrderPrivateDocument,
};
