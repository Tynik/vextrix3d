import type { FirebaseOptions } from '@firebase/app';
import { initializeApp } from 'firebase/app';
import { once } from '@react-hive/honey-utils';

import { getSecretsStore } from './blobs';

const _initFirebaseApp = async () => {
  const store = getSecretsStore();

  const firebaseConfig = (await store.get('firebase-config.json', {
    type: 'json',
  })) as FirebaseOptions;

  return initializeApp(firebaseConfig);
};

export const initFirebaseApp = once(_initFirebaseApp);
