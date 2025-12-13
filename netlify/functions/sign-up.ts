import admin, { FirebaseError } from 'firebase-admin';

import { createHandler } from '../utils';
import { initFirebaseAdminApp } from '../firebase';

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

    try {
      await initFirebaseAdminApp();

      const userRecord = await admin.auth().createUser({
        email: payload.email,
        password: payload.password,
        displayName: payload.displayName ?? '',
        phoneNumber: payload.phoneNumber ?? '',
      });

      const serverTimestamp = admin.firestore.FieldValue.serverTimestamp();

      await admin.firestore().doc(`users/${userRecord.uid}`).set({
        id: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        phoneNumber: userRecord.phoneNumber,
        role: 'user',
        createdAt: serverTimestamp,
        updatedAt: serverTimestamp,
      });

      return {
        status: 'ok',
        data: {
          userId: userRecord.uid,
        },
      };
    } catch (e) {
      const error = e as FirebaseError;

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
