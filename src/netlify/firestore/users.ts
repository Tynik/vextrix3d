import admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { assert } from '@react-hive/honey-utils';

import type { Nullable } from '~/types';
import type { UserDocument } from './document-types';
import type { AccountRole, StripeCustomerId } from '../types';
import { getUserDocRef } from './document-references';

export const getExistingUserDocument = async (userId: string): Promise<UserDocument> => {
  const userDocRef = getUserDocRef(userId);

  const docSnap = await userDocRef.get();
  assert(docSnap.exists, 'User document does not exist');

  const userDoc = docSnap.data();
  assert(userDoc, 'User document data is empty');

  return userDoc;
};

interface CreateUserOptions {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: AccountRole;
  phone?: Nullable<string>;
  stripeCustomerId?: Nullable<StripeCustomerId>;
}

export const createUser = async ({
  firstName,
  lastName,
  email,
  password,
  role = 'customer',
  phone = null,
  stripeCustomerId = null,
}: CreateUserOptions) => {
  const auth = admin.auth();

  const userRecord = await auth.createUser({
    email,
    password,
    displayName: [firstName, lastName].filter(Boolean).join(' '),
    phoneNumber: phone ?? undefined,
  });

  await auth.setCustomUserClaims(userRecord.uid, {
    role,
  });

  const userDocRef = getUserDocRef(userRecord.uid);

  await userDocRef.set({
    id: userRecord.uid,
    stripeCustomerId,
    role,
    email,
    firstName,
    lastName,
    phone,
    updatedAt: null,
    createdAt: Timestamp.now(),
  });

  return userRecord;
};
