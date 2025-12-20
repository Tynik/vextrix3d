import admin from 'firebase-admin';
import type { CollectionReference, DocumentReference } from 'firebase-admin/firestore';

import type { OrderDocument, QuoteDocument, UserDocument } from './document-types';
import {
  orderConverter,
  quoteConverter,
  quoteHistoryStatusChangeConverter,
  userConverter,
} from './data-convertors';

export const USERS_COLLECTION_NAME = 'users';
export const QUOTES_COLLECTION_NAME = 'quotes';
export const QUOTE_HISTORY_COLLECTION_NAME = 'history';
export const ORDERS_COLLECTION_NAME = 'orders';

export const getUsersCollection = (
  firestore = admin.firestore(),
): CollectionReference<UserDocument> =>
  firestore.collection(USERS_COLLECTION_NAME).withConverter(userConverter);

export const getQuotesCollection = (
  firestore = admin.firestore(),
): CollectionReference<QuoteDocument> =>
  firestore.collection(QUOTES_COLLECTION_NAME).withConverter(quoteConverter);

export const getQuoteHistoryCollection = (quoteRef: DocumentReference<QuoteDocument>) =>
  quoteRef
    .collection(QUOTE_HISTORY_COLLECTION_NAME)
    .withConverter(quoteHistoryStatusChangeConverter);

export const getOrdersCollection = (
  firestore = admin.firestore(),
): CollectionReference<OrderDocument> =>
  firestore.collection(ORDERS_COLLECTION_NAME).withConverter(orderConverter);
