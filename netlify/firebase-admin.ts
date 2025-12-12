import type { ServiceAccount } from 'firebase-admin/app';
import { initializeApp, cert } from 'firebase-admin/app';

import { getSecretsStore } from './blobs';
import { once } from '@react-hive/honey-utils';

const _initFirebaseAdminApp = async () => {
  const store = getSecretsStore();

  const serviceAccount = (await store.get('vextrix3d-a164a-aa795721a03b.json', {
    type: 'json',
  })) as ServiceAccount;

  return initializeApp({
    credential: cert(serviceAccount),
  });
};

export const initFirebaseAdminApp = once(_initFirebaseAdminApp);
