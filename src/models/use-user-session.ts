import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import type { Nullable } from '~/types';
import { ROUTES } from '~/configs';
import { getCookieValue } from '~/utils';
import type { User, VerifySessionRequestError } from '~/api';
import { verifySessionRequest } from '~/api';

export const useUserSession = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<Nullable<User>>(null);

  const sessionCookie = getCookieValue('session');

  const { isEnabled, isLoading } = useQuery({
    queryKey: ['verify-session', sessionCookie],
    queryFn: async () => {
      try {
        const session = await verifySessionRequest();
        setUser(session.user);

        return session;
      } catch (e) {
        setUser(null);

        const error = e as VerifySessionRequestError;

        if (error.data.error.name === 'Error') {
          const redirectPath = encodeURIComponent(location.pathname + location.search);

          return navigate(`${ROUTES.auth.signIn}?redirect=${redirectPath}`, {
            replace: true,
          });
        }

        return Promise.reject(error);
      }
    },
    refetchInterval: 900000, // 15 minutes
    refetchIntervalInBackground: true,
    enabled: Boolean(sessionCookie),
  });

  return {
    user,
    setUser,
    hasSession: isEnabled,
    isAuthenticating: isLoading,
  };
};
