import admin from 'firebase-admin';
import { FirebaseAuthError } from 'firebase-admin/auth';

import { IS_LOCAL_ENV, ONE_DAY_SECS } from '../constants';
import { createHandler } from '../utils';
import { initFirebaseAdminApp } from '../firebase';

interface SignInPayload {
  idToken: string;
}

export const handler = createHandler<SignInPayload>(
  { allowedMethods: ['POST'] },
  async ({ payload }) => {
    if (!payload?.idToken) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'ID token is required',
        },
      };
    }

    try {
      await initFirebaseAdminApp();

      const firebaseAuth = admin.auth();

      const decodedIdToken = await firebaseAuth.verifyIdToken(payload.idToken, true);

      const expiresInMs = ONE_DAY_SECS;
      const sessionCookie = await firebaseAuth.createSessionCookie(payload.idToken, {
        expiresIn: expiresInMs * 1000,
      });

      return {
        status: 'ok',
        data: {
          uid: decodedIdToken.uid,
          email: decodedIdToken.email,
          isEmailVerified: decodedIdToken.email_verified,
        },
        cookie: {
          name: 'session',
          value: sessionCookie,
          maxAge: expiresInMs,
          sameSite: IS_LOCAL_ENV ? 'None' : 'Strict',
          secure: true,
        },
      };
    } catch (e) {
      const error = e as FirebaseAuthError;

      console.error(error);

      return {
        status: 'error',
        statusCode: 401,
        data: {
          error: {
            name: error.name,
            code: error.code,
          },
        },
      };
    }
  },
);
