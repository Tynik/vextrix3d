import type { FirebaseOptions } from '@firebase/app';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { assert } from '@react-hive/honey-utils';

import { FIREBASE_CONFIG } from './constants';

const initFirebaseApp = () => {
  assert(FIREBASE_CONFIG, 'The `FIREBASE_CONFIG` must be set as environment variable');

  const config = JSON.parse(atob(FIREBASE_CONFIG)) as FirebaseOptions;

  return initializeApp(config);
};

const firebaseApp = initFirebaseApp();

export const firebaseAuth = getAuth(firebaseApp);
