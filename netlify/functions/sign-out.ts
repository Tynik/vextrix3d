import { getAuth } from 'firebase-admin/auth';

import { IS_LOCAL_ENV } from '../constants';
import { createHandler } from '../utils';
import { initFirebaseAdminApp } from '../firebase';
import { withSession } from '../auth';

export const handler = createHandler(
  {
    allowedMethods: ['POST'],
  },
  withSession(async ({ cookies }) => {
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
  }),
);
