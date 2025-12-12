import { getAuth } from 'firebase-admin/auth';
import { FirebaseAuthError } from 'firebase-admin/auth';

import { createHandler } from '../utils';
import { initFirebaseAdminApp } from '../firebase-admin';

export const handler = createHandler(
  {
    allowedMethods: ['GET'],
  },
  async ({ cookies }) => {
    if (!cookies.session) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'The session is not provided',
        },
      };
    }

    try {
      const firebaseAdminApp = await initFirebaseAdminApp();

      const token = await getAuth(firebaseAdminApp).verifySessionCookie(cookies.session, true);

      return {
        status: 'ok',
        data: {
          email: token.email,
          expiresAt: token.exp,
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
