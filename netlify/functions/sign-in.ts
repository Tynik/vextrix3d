import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebase from 'firebase/compat/app';

import { IS_LOCAL_ENV, ONE_DAY_SECS } from '../constants';
import { createHandler } from '../utils';
import { initFirebaseAdminApp } from '../firebase-admin';
import { initFirebaseApp } from '../firebase';

import FirebaseError = firebase.FirebaseError;

interface SignInPayload {
  email: string;
  password: string;
}

export const handler = createHandler<SignInPayload>(
  {
    allowedMethods: ['POST'],
  },
  async ({ payload }) => {
    if (!payload) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'Payload is empty',
        },
      };
    }

    if (!payload.email || !payload.password) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'Invalid data',
        },
      };
    }

    try {
      const firebaseAdminApp = await initFirebaseAdminApp();
      const firebaseApp = await initFirebaseApp();
      const firebaseAuth = getAuth(firebaseApp);

      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        payload.email,
        payload.password,
      );

      const { user } = userCredential;

      const idToken = await user.getIdToken(true);

      const expiresIn = ONE_DAY_SECS;
      const sessionCookie = await getAdminAuth(firebaseAdminApp).createSessionCookie(idToken, {
        expiresIn: expiresIn * 1000,
      });

      return {
        status: 'ok',
        data: {
          email: user.email,
          displayName: user.displayName,
          phoneNumber: user.phoneNumber,
          isEmailVerified: user.emailVerified,
        },
        cookie: {
          name: 'session',
          value: sessionCookie,
          maxAge: expiresIn,
          sameSite: IS_LOCAL_ENV ? 'None' : 'Strict',
          secure: true,
        },
      };
    } catch (e) {
      const error = e as FirebaseError;

      console.log(error);

      return {
        status: 'error',
        statusCode: 400,
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
