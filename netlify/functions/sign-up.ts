import admin, { FirebaseError } from 'firebase-admin';
import { assert } from '@react-hive/honey-utils';

import { createHandler } from '../utils';
import { initFirebaseAdminApp } from '../firebase';
import { Nullable } from '../types';
import { UserRecord } from 'firebase-admin/auth';

interface SignupPayload {
  email: string;
  password: string;
  displayName?: string;
  phoneNumber?: string;
}

export const handler = createHandler<SignupPayload>(
  {
    allowedMethods: ['POST'],
  },
  async ({ payload }) => {
    if (!payload?.email || !payload?.password) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'Invalid data',
        },
      };
    }

    await initFirebaseAdminApp();

    const firebaseAuth = admin.auth();

    let userRecord: Nullable<UserRecord> = null;

    try {
      userRecord = await firebaseAuth.createUser({
        email: payload.email,
        password: payload.password,
        displayName: payload.displayName,
        phoneNumber: payload.phoneNumber,
      });

      assert(userRecord.email, 'The email must be set');

      const serverTimestamp = admin.firestore.FieldValue.serverTimestamp();

      await admin
        .firestore()
        .doc(`users/${userRecord.uid}`)
        .set({
          id: userRecord.uid,
          role: 'user',
          email: userRecord.email,
          displayName: userRecord.displayName ?? null,
          phoneNumber: userRecord.phoneNumber ?? null,
          createdAt: serverTimestamp,
          updatedAt: serverTimestamp,
        });

      return {
        status: 'ok',
        data: {},
      };
    } catch (e) {
      if (userRecord) {
        await firebaseAuth.deleteUser(userRecord.uid);
      }

      const error = e as FirebaseError;

      console.error(error);

      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: {
            name: 'FirebaseError',
            code: error.code,
          },
        },
      };
    }
  },
);
