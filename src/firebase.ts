import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

import { FIREBASE_APP_NAME, FIREBASE_CONFIG } from '~/configs';

export const firebaseApp = initializeApp(FIREBASE_CONFIG, FIREBASE_APP_NAME);
export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
