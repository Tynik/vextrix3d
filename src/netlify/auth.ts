import { FirebaseError } from 'firebase-admin';
import { FirebaseAuthError } from 'firebase-admin/auth';

import type { CreateHandlerFunction, CreateHandlerFunctionOptions } from './utils';

export const withSession =
  <Payload = unknown>(
    fn: (
      options: CreateHandlerFunctionOptions<Payload>,
    ) => ReturnType<CreateHandlerFunction<Payload>>,
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
      return fn(options);
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
