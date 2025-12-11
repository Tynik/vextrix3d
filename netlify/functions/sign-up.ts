import { createUserWithEmailAndPassword } from 'firebase/auth';
import firebase from 'firebase/compat/app';

import { createHandler } from '../utils';
import { firebaseAuth } from '../firebase';

import FirebaseError = firebase.FirebaseError;

interface SignupPayload {
  email: string;
  password: string;
}

export const handler = createHandler<SignupPayload>(
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
      await createUserWithEmailAndPassword(firebaseAuth, payload.email, payload.password);

      return {
        status: 'ok',
        data: {},
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
