import admin from 'firebase-admin';

import { createHandler } from '../utils';
import { initFirebaseAdminApp } from '../firebase-admin';
import { FirebaseAuthError } from 'firebase-admin/auth';

export const handler = createHandler(
  {
    allowedMethods: ['GET'],
  },
  async ({ cookies }) => {
    if (!cookies.idToken) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'The ID token is not provided',
        },
      };
    }

    await initFirebaseAdminApp();

    try {
      const token = await admin.auth().verifyIdToken(cookies.idToken);

      return {
        status: 'ok',
        data: {
          email: token.email,
          expiredAt: token.exp,
          isEmailVerified: token.email_verified,
        },
      };
    } catch (e) {
      const error = e as FirebaseAuthError;

      console.error(error);

      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: {
            name: error.name,
            code: error,
          },
        },
      };
    }
  },
);
