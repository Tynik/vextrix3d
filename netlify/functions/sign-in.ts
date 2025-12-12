import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import firebase from 'firebase/compat/app';

import { IS_LOCAL_ENV } from '../constants';
import { createHandler } from '../utils';
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
      const firebaseApp = await initFirebaseApp();
      const firebaseAuth = getAuth(firebaseApp);

      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        payload.email,
        payload.password,
      );

      const idTokenResult = await userCredential.user.getIdTokenResult(true);

      const expiresAt = new Date(idTokenResult.expirationTime).getTime();
      const maxAge = Math.floor((expiresAt - Date.now()) / 1000);

      return {
        status: 'ok',
        data: {},
        cookie: {
          maxAge,
          name: 'idToken',
          value: idTokenResult.token,
          sameSite: IS_LOCAL_ENV ? 'None' : 'Strict',
          secure: true,
        },
      };
    } catch (e) {
      const error = e as FirebaseError;

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
