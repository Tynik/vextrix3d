import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { ROUTES } from '~/configs';
import { useAppContext } from '~/models';
import { ProfilePage, Page } from '~/pages';

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
    <Routes>
      <Route path={ROUTES.account.profile} element={<ProfilePage />} />
    </Routes>
  );
};
