import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import type { AppContextValue } from '~/models';
import { AppContext, useUserSession } from '~/models';
import { ProfessionalServiceMicrodata } from '~/seo';
import { AppRoutes } from '~/routes';
import { Footer } from '~/pages';

export const App = () => {
  const location = useLocation();

  const { hasSession, isAuthenticating, user, setUser } = useUserSession();

  useEffect(() => {
    const htmlElements = document.getElementsByTagName('html');

    htmlElements[0]?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [location.pathname]);

  const contextValue = useMemo<AppContextValue>(
    () => ({
      hasSession,
      isAuthenticating,
      user,
      setUser,
    }),
    [hasSession, isAuthenticating, user],
  );

  return (
    <AppContext value={contextValue}>
      <ProfessionalServiceMicrodata />

      <AppRoutes />

      <Footer />

      <ToastContainer position="top-center" />
    </AppContext>
  );
};
