import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import type { Nullable } from '~/types';
import type { User } from '~/netlify/types';
import { auth } from '~/firebase';
import { handleApiError, getUserProfileRequest } from '~/api';

export const useAuth = () => {
  const [user, setUser] = useState<Nullable<User>>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

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
    user,
    setUser,
    isUserLoading,
  };
};
