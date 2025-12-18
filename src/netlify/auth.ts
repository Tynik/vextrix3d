import { auth, FirebaseError } from 'firebase-admin';
import type { Auth } from 'firebase-admin/auth';
import { getAuth, FirebaseAuthError } from 'firebase-admin/auth';

import type { CreateHandlerFunction, HandlerFunctionOptions } from './utils';
import { initFirebaseAdminApp } from './firebase';

interface SessionHandlerOptions<Payload = unknown> extends HandlerFunctionOptions<Payload> {
  auth: Auth;
  decodedIdToken: auth.DecodedIdToken;
}

export const withSession =
  <Payload = unknown>(
    fn: (options: SessionHandlerOptions<Payload>) => ReturnType<CreateHandlerFunction<Payload>>,
  ): CreateHandlerFunction<Payload> =>
  async options => {
    const { cookies } = options;

    if (!cookies.session) {
      return {
        status: 'error',
        statusCode: 401,
        data: {
          error: 'The session is not provided',
        },
      };
    }

    try {
      await initFirebaseAdminApp();

      const auth = getAuth();
      const decodedIdToken = await auth.verifySessionCookie(cookies.session, true);

      return fn({
        auth,
        decodedIdToken,
        ...options,
      });
    } catch (e) {
      const error = e as FirebaseError;

      console.error(e);

      return {
        status: 'error',
        statusCode: e instanceof FirebaseAuthError ? 401 : 500,
        data: {
          error: {
            name: e instanceof FirebaseAuthError ? 'FirebaseAuthError' : 'FirebaseError',
            code: error.code,
          },
        },
      };
    }
  };
