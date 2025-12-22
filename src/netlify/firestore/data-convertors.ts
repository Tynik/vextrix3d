import type { FirestoreDataConverter } from 'firebase-admin/firestore';

import type {
  SequenceDocument,
  OrderDocument,
  QuoteDocument,
  QuoteHistoryStatusChangeDocument,
  UserDocument,
  OrderPrivatePaymentDocument,
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

export const orderConverter: FirestoreDataConverter<OrderDocument> = {
  toFirestore: data => data,
  fromFirestore: snapshot => snapshot.data() as OrderDocument,
};

export const orderPrivatePaymentConverter: FirestoreDataConverter<OrderPrivatePaymentDocument> = {
  toFirestore: data => data,
  fromFirestore: snapshot => snapshot.data() as OrderPrivatePaymentDocument,
};
