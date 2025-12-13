import React from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { ROUTES } from '~/configs';
import { useAppContext } from '~/models';
import { Progress } from '~/components';
import {
  LandingPage,
  MaterialSafetyDisclaimerPage,
  ModelSubmissionPolicyPage,
  RefundPolicyPage,
  ShippingPolicyPage,
  TermsOfServicePage,
  IntellectualPropertyPolicyPage,
  QuoteRequestPage,
  SignUpPage,
  SignInPage,
  ProfilePage,
  Page,
} from '~/pages';

const AccountRoutes = () => {
  const location = useLocation();

  const { isUserLoading, user } = useAppContext();

  if (isUserLoading) {
    return (
      <Page title="Loading...">
        <Progress $margin={[0, 'auto']} />
      </Page>
    );
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

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path={ROUTES.legal.terms} element={<TermsOfServicePage />} />
      <Route path={ROUTES.legal.shipping} element={<ShippingPolicyPage />} />
      <Route path={ROUTES.legal.refund} element={<RefundPolicyPage />} />
      <Route path={ROUTES.legal.modelSubmission} element={<ModelSubmissionPolicyPage />} />
      <Route path={ROUTES.legal.safety} element={<MaterialSafetyDisclaimerPage />} />
      <Route path={ROUTES.legal.ip} element={<IntellectualPropertyPolicyPage />} />

      <Route path={ROUTES.quote} element={<QuoteRequestPage />} />
      <Route path={ROUTES.auth.signUp} element={<SignUpPage />} />
      <Route path={ROUTES.auth.signIn} element={<SignInPage />} />
      <Route path={ROUTES.home} element={<LandingPage />} />

      {/* Protected */}
      <Route path={`${ROUTES.account.base}/*`} element={<AccountRoutes />} />
    </Routes>
  );
};
