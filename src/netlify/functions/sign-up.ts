import type { FirebaseError } from 'firebase-admin';
import type { UserRecord } from 'firebase-admin/auth';
import { getAuth } from 'firebase-admin/auth';

import type { Nullable } from '~/types';
import { createHandler } from '../utils';
import { initFirebaseAdminApp } from '../firebase';
import { createUser } from '../firestore';

export interface SignupPayload {
  email: string;
  password: string;
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
          error: {
            message: 'Invalid data',
          },
        },
      };
    }

    await initFirebaseAdminApp();

    const auth = getAuth();

    let userRecord: Nullable<UserRecord> = null;

    try {
      userRecord = await createUser({
        firstName: '',
        lastName: '',
        email: payload.email,
        password: payload.password,
      });

      return {
        status: 'ok',
        data: {},
      };
    } catch (e) {
      if (userRecord) {
        await auth.deleteUser(userRecord.uid);
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
