import admin from 'firebase-admin';
import type { CollectionReference, DocumentReference } from 'firebase-admin/firestore';

import type { OrderDocument, QuoteDocument, UserDocument } from './document-types';
import {
  orderConverter,
  quoteConverter,
  quoteHistoryStatusChangeConverter,
  userConverter,
} from './data-convertors';

export const PRIVATE_COLLECTION_NAME = 'private';
export const USERS_COLLECTION_NAME = 'users';
export const QUOTES_COLLECTION_NAME = 'quotes';
export const QUOTE_HISTORY_COLLECTION_NAME = 'history';
export const ORDERS_COLLECTION_NAME = 'orders';
export const SEQUENCES_COLLECTION_NAME = 'sequences';

export const getUsersCollectionRef = (
  firestore = admin.firestore(),
): CollectionReference<UserDocument> =>
  firestore.collection(USERS_COLLECTION_NAME).withConverter(userConverter);

export const getQuotesCollectionRef = (
  firestore = admin.firestore(),
): CollectionReference<QuoteDocument> =>
  firestore.collection(QUOTES_COLLECTION_NAME).withConverter(quoteConverter);

export const getQuoteHistoryCollectionRef = (quoteRef: DocumentReference<QuoteDocument>) =>
  quoteRef
    .collection(QUOTE_HISTORY_COLLECTION_NAME)
    .withConverter(quoteHistoryStatusChangeConverter);

export const getOrdersCollectionRef = (
  firestore = admin.firestore(),
): CollectionReference<OrderDocument> =>
  firestore.collection(ORDERS_COLLECTION_NAME).withConverter(orderConverter);
