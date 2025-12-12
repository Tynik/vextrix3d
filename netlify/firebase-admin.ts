import type { ServiceAccount } from 'firebase-admin/app';
import { initializeApp, cert } from 'firebase-admin/app';
import { assert, once } from '@react-hive/honey-utils';

import { getSecretsStore } from './blobs';
import { FIREBASE_SERVICE_ACCOUNT_FILENAME } from './constants';

const _initFirebaseAdminApp = async () => {
  assert(
    FIREBASE_SERVICE_ACCOUNT_FILENAME,
    'The `FIREBASE_SERVICE_ACCOUNT_FILENAME` must be set as environment variable',
  );

  const store = getSecretsStore();

  const serviceAccount = (await store.get(FIREBASE_SERVICE_ACCOUNT_FILENAME, {
    type: 'json',
  })) as ServiceAccount;

  return initializeApp({
    credential: cert(serviceAccount),
  });
};

export const initFirebaseAdminApp = once(_initFirebaseAdminApp);
