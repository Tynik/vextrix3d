import { IS_LOCAL_ENV } from '../constants';
import { createHandler } from '../utils';
import { withSession } from '../auth';

export const handler = createHandler(
  {
    allowedMethods: ['POST'],
  },
  withSession(async ({ auth, decodedIdToken }) => {
    await auth.revokeRefreshTokens(decodedIdToken.sub);

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
  }),
);
