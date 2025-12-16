import type { FirebaseOptions } from '@firebase/app';

export const FIREBASE_CONFIG: FirebaseOptions = {
  apiKey: 'AIzaSyC9DVlMv__44e0WR8zeqT_fVnYY5dtbB2Q',
  authDomain: 'vextrix3d-a164a.firebaseapp.com',
  projectId: 'vextrix3d-a164a',
  storageBucket: 'vextrix3d-a164a.firebasestorage.app',
  messagingSenderId: '269764779484',
  appId: '1:269764779484:web:bb08a4f1d3fb0a32be4319',
  measurementId: 'G-LL8JCCVBS3',
};

/**
 * @see https://firebase.google.com/docs/auth/admin/errors
 */
export const FIREBASE_AUTH_ERRORS: Record<string, string> = {
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/user-not-found': 'Invalid email or password.',
  'auth/invalid-password': 'Invalid email or password.',
  'auth/too-many-requests': 'Too many attempts. Try again later.',
  'auth/email-already-exists': 'Email is already in use.',
  'auth/invalid-email': 'Invalid email.',
  'auth/invalid-phone-number': 'Invalid phone number.',
};
