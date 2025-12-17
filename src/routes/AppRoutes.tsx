import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { ROUTES } from '~/configs';
import {
  LandingPage,
  MaterialSafetyDisclaimerPage,
  ModelSubmissionPolicyPage,
  RefundPolicyPage,
  ShippingPolicyPage,
  TermsOfServicePage,
  IntellectualPropertyPolicyPage,
  QuoteRequestPage,
  SignInPage,
} from '~/pages';
import { AccountRoutes } from './AccountRoutes';

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
      {/*<Route path={ROUTES.auth.signUp} element={<SignUpPage />} />*/}
      <Route path={ROUTES.auth.signIn} element={<SignInPage />} />
      <Route path={ROUTES.home} element={<LandingPage />} />

      {/* Protected */}
      <Route path={`${ROUTES.account.base}/*`} element={<AccountRoutes />} />
    </Routes>
  );
};
