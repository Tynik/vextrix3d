import { FirebaseAuthError, getAuth } from 'firebase-admin/auth';

import { createHandler } from '../utils';
import { initFirebaseAdminApp } from '../firebase';
import type { User } from '../types';
import { getExistingUserDocument } from '../firestore';

export const handler = createHandler<{ idToken: string }>(
  {
    allowedMethods: ['GET'],
  },
  async ({ headers }) => {
    if (!headers.authorization?.startsWith('Bearer ')) {
      return {
        status: 'error',
        statusCode: 401,
        data: {
          error: {
            message: 'Authorization token is missing',
          },
        },
      };
    }

    const idToken = headers.authorization.replace('Bearer ', '');

    try {
      await initFirebaseAdminApp();

      const decodedIdToken = await getAuth().verifyIdToken(idToken, true);
      const user = await getExistingUserDocument(decodedIdToken.uid);

      return {
        status: 'ok',
        data: {
          role: user.role,
          email: user.email,
          isEmailVerified: decodedIdToken.email_verified ?? false,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
        } satisfies User,
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
            code: error.code,
          },
        },
      };
    }
  },
);
