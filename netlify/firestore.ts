import admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import type {
  DocumentData,
  FirestoreDataConverter,
  CollectionReference,
  DocumentReference,
} from 'firebase-admin/firestore';
import { assert } from '@react-hive/honey-utils';
import Stripe from 'stripe';

import type { Nullable } from './types';

interface UserDocumentData extends DocumentData {
  id: string;
  stripeCustomerId: Nullable<Stripe.Customer['id']>;
  role: 'user' | 'admin';
  email: string;
  displayName: Nullable<string>;
  phoneNumber: Nullable<string>;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

const userConverter: FirestoreDataConverter<UserDocumentData> = {
  toFirestore: data => data,
  fromFirestore: snapshot => snapshot.data() as UserDocumentData,
};

export const getUsersCollection = (): CollectionReference<UserDocumentData> =>
  admin.firestore().collection('users').withConverter(userConverter);

export const getUserDocument = (userId: string): DocumentReference<UserDocumentData> =>
  admin.firestore().doc(`users/${userId}`).withConverter(userConverter);

export const getExistingUserDocument = async (userId: string) => {
  const ref = getUserDocument(userId);
  const snap = await ref.get();

  assert(snap.exists, 'User document does not exist');

  return snap.data();
};
