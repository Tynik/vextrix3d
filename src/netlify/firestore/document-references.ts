import admin from 'firebase-admin';
import type { DocumentReference } from 'firebase-admin/firestore';

import type { OrderId, QuoteId } from '~/netlify/types';
import type {
  OrderDocument,
  QuoteDocument,
  QuoteHistoryChangeId,
  QuoteHistoryStatusChangeDocument,
  UserDocument,
} from './document-types';
import {
  ORDERS_COLLECTION_NAME,
  QUOTE_HISTORY_COLLECTION_NAME,
  QUOTES_COLLECTION_NAME,
  USERS_COLLECTION_NAME,
} from './collections';
import {
  orderConverter,
  quoteConverter,
  quoteHistoryStatusChangeConverter,
  userConverter,
} from './data-convertors';

export const getUserDocumentRef = (
  userId: string,
  firestore = admin.firestore(),
): DocumentReference<UserDocument> =>
  firestore.doc(`${USERS_COLLECTION_NAME}/${userId}`).withConverter(userConverter);

export const getQuoteDocumentRef = (
  quoteId: QuoteId,
  firestore = admin.firestore(),
): DocumentReference<QuoteDocument> =>
  firestore.doc(`${QUOTES_COLLECTION_NAME}/${quoteId}`).withConverter(quoteConverter);

export const getQuoteHistoryStatusChangeDocumentRef = (
  quoteId: QuoteId,
  quoteHistoryId: QuoteHistoryChangeId,
  firestore = admin.firestore(),
): DocumentReference<QuoteHistoryStatusChangeDocument> =>
  firestore
    .doc(`${QUOTES_COLLECTION_NAME}/${quoteId}/${QUOTE_HISTORY_COLLECTION_NAME}/${quoteHistoryId}`)
    .withConverter(quoteHistoryStatusChangeConverter);

export const getOrderDocumentRef = (
  orderId: OrderId,
  firestore = admin.firestore(),
): DocumentReference<OrderDocument> =>
  firestore.doc(`${ORDERS_COLLECTION_NAME}/${orderId}`).withConverter(orderConverter);
