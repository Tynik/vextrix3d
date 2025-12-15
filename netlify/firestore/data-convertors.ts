import type { FirestoreDataConverter } from 'firebase-admin/firestore';

import type {
  QuoteDocument,
  QuoteHistoryStatusChangeDocument,
  UserDocument,
} from './document-types';

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
