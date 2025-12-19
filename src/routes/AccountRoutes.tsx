import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { createGlobalStyle, css } from '@react-hive/honey-style';

import { ROUTES } from '~/configs';
import { useAppContext } from '~/models';
import { Page, ProfilePage, QuotesPage } from '~/pages';

const GlobalStyle = createGlobalStyle`
   ${({ theme: { colors } }) => css`
     #root {
       background-color: ${colors.neutral.grayUltraLight};
     }
   `}
  `;

export const AccountRoutes = () => {
  const location = useLocation();

  const { isUserLoading, user } = useAppContext();

  if (isUserLoading) {
    return <Page title="Loading..." loading={isUserLoading} />;
  }

  if (!user) {
    const redirectPath = encodeURIComponent(location.pathname + location.search);

    return <Navigate to={`${ROUTES.auth.signIn}?redirect=${redirectPath}`} replace />;
  }

  return (
    <>
      <GlobalStyle />

      <Routes>
        <Route path={ROUTES.account.profile} element={<ProfilePage />} />
        <Route path={ROUTES.account.quotes} element={<QuotesPage />} />
      </Routes>
    </>
  );
};
