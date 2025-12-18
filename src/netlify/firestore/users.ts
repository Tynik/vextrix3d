import admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import type { DocumentReference } from 'firebase-admin/firestore';
import { assert } from '@react-hive/honey-utils';

import type { Nullable } from '~/types';
import type { StipeCustomerId } from './generic';
import type { AccountRole, UserDocument } from './document-types';
import { USERS_COLLECTION_NAME } from './collections';
import { userConverter } from './data-convertors';

export const getUserDocumentRef = (userId: string): DocumentReference<UserDocument> =>
  admin.firestore().doc(`${USERS_COLLECTION_NAME}/${userId}`).withConverter(userConverter);

export const getExistingUserDocument = async (userId: string): Promise<UserDocument> => {
  const documentReference = getUserDocumentRef(userId);

  const documentSnapshot = await documentReference.get();
  assert(documentSnapshot.exists, 'User document does not exist');

  const userDocument = documentSnapshot.data();
  assert(userDocument, 'User document data is empty');

  return userDocument;
};

interface CreateUserOptions {
  email: string;
  password: string;
  role?: AccountRole;
  firstName?: Nullable<string>;
  lastName?: Nullable<string>;
  phone?: Nullable<string>;
  stripeCustomerId?: Nullable<StipeCustomerId>;
}

export const createUser = async ({
  email,
  password,
  role = 'customer',
  firstName = null,
  lastName = null,
  phone = null,
  stripeCustomerId = null,
}: CreateUserOptions) => {
  const firebaseAuth = admin.auth();

  const userRecord = await firebaseAuth.createUser({
    email,
    password,
    displayName: [firstName, lastName].filter(Boolean).join(' '),
    phoneNumber: phone ?? undefined,
  });

  const userDocument = getUserDocumentRef(userRecord.uid);
  const now = Timestamp.now();

  await userDocument.set({
    id: userRecord.uid,
    stripeCustomerId,
    role,
    email,
    firstName,
    lastName,
    phone,
    createdAt: now,
    updatedAt: now,
  });

  return userRecord;
};
