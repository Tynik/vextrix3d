import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ToastContainer } from 'react-toastify';
import { assert } from '@react-hive/honey-utils';

import type { Nullable } from '~/types';
import { FIREBASE_CONFIG } from '~/configs';
import type { User } from '~/api';
import type { AppContextValue } from '~/models';
import { AppContext } from '~/models';
import { ProfessionalServiceMicrodata } from '~/seo';
import { AppRoutes } from '~/AppRoutes';
import { Footer, Header } from '~/pages';

export const App = () => {
  const location = useLocation();

  const [user, setUser] = useState<Nullable<User>>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    const htmlElements = document.getElementsByTagName('html');

    htmlElements[0]?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [location.pathname]);

  const firebaseApp = useMemo(() => initializeApp(FIREBASE_CONFIG), []);

  const firebaseAuth = useMemo(() => getAuth(firebaseApp), [firebaseApp]);

  useEffect(
    () =>
      onAuthStateChanged(firebaseAuth, fbUser => {
        if (fbUser) {
          assert(fbUser.email, 'Email must be provided by Firebase Auth.');

          setUser({
            email: fbUser.email,
            displayName: fbUser.displayName,
            phoneNumber: fbUser.phoneNumber,
            isEmailVerified: fbUser.emailVerified,
          });
        } else {
          setUser(null);
        }

        setIsUserLoading(false);
      }),
    [firebaseAuth],
  );

  const contextValue = useMemo<AppContextValue>(
    () => ({
      firebaseAuth,
      user,
      isUserLoading,
      setUser,
    }),
    [firebaseAuth, user, isUserLoading],
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
