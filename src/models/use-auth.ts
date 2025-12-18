import { useEffect, useMemo, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import type { Nullable } from '~/types';
import type { User } from '~/netlify/types';
import { FIREBASE_CONFIG } from '~/configs';
import { handleApiError, getUserProfileRequest } from '~/api';

export const useAuth = () => {
  const [user, setUser] = useState<Nullable<User>>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  const firebaseApp = useMemo(() => initializeApp(FIREBASE_CONFIG, 'Vextrix3D'), []);

  const auth = useMemo(() => getAuth(firebaseApp), [firebaseApp]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, fbUser => {
      if (fbUser) {
        fbUser.getIdToken().then(idToken => {
          getUserProfileRequest(idToken)
            .then(setUser)
            .catch(handleApiError)
            .finally(() => setIsUserLoading(false));
        });
      } else {
        setUser(null);
        setIsUserLoading(false);
      }
    });

    return unsubscribe;
  }, [auth]);

  return {
    firebaseApp,
    auth,
    user,
    setUser,
    isUserLoading,
  };
};
