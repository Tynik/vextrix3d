import { getAuth } from 'firebase-admin/auth';
import { FirebaseAuthError } from 'firebase-admin/auth';

import { createHandler } from '../utils';
import { initFirebaseAdminApp } from '../firebase';
import { IS_LOCAL_ENV } from '../constants';

export const handler = createHandler(
  {
    allowedMethods: ['POST'],
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
      await initFirebaseAdminApp();

      const firebaseAuth = getAuth();

      const decodedIdToken = await firebaseAuth.verifySessionCookie(cookies.session, true);

      await firebaseAuth.revokeRefreshTokens(decodedIdToken.sub);

      return {
        status: 'ok',
        data: {},
        cookie: {
          name: 'session',
          value: '',
          maxAge: 0,
          sameSite: IS_LOCAL_ENV ? 'None' : 'Strict',
          secure: true,
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
