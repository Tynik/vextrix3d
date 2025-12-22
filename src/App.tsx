import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import type { AppContextValue } from '~/models';
import { AppContext, useAuth } from '~/models';
import { ProfessionalServiceMicrodata } from '~/seo';
import { AppRoutes } from '~/routes';
import { Footer, Header } from '~/pages';

export const App = () => {
  const location = useLocation();

  useEffect(() => {
    const htmlElements = document.getElementsByTagName('html');

    htmlElements[0]?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [location.pathname]);

  const { user, setUser, isUserLoading } = useAuth();

  const contextValue = useMemo<AppContextValue>(
    () => ({
      user,
      isAdmin: user?.role === 'admin',
      isUserLoading,
      setUser,
    }),
    [user, isUserLoading],
  );

  return (
    <AppContext value={contextValue}>
      <ProfessionalServiceMicrodata />

      <Header />

      <AppRoutes />

      <Footer $marginTop="auto" />

      <ToastContainer position="top-center" />
    </AppContext>
  );
};
