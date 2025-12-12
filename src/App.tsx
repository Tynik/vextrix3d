import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';

import { ROUTES } from '~/configs';
import { getCookieValue } from '~/utils';
import { ProfessionalServiceMicrodata } from '~/seo';
import type { VerifySessionRequestError } from '~/api';
import { verifySessionRequest } from '~/api';
import {
  LandingPage,
  MaterialSafetyDisclaimerPage,
  ModelSubmissionPolicyPage,
  RefundPolicyPage,
  ShippingPolicyPage,
  TermsOfServicePage,
  IntellectualPropertyPolicyPage,
  QuoteRequestPage,
  Footer,
  SignUpPage,
  SignInPage,
} from '~/pages';

export const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const session = getCookieValue('session');

  useQuery({
    queryKey: ['verify-session', session],
    queryFn: async () => {
      try {
        return await verifySessionRequest();
      } catch (e) {
        const error = e as VerifySessionRequestError;

        if (error.data.error.name === 'Error') {
          const redirectPath = encodeURIComponent(location.pathname + location.search);

          return navigate(`${ROUTES.auth.signIn}?redirect=${redirectPath}`);
        }

        return Promise.reject(error);
      }
    },
    refetchInterval: 900000, // 15 minutes
    refetchIntervalInBackground: true,
    enabled: Boolean(session),
  });

  useEffect(() => {
    const htmlElements = document.getElementsByTagName('html');

    htmlElements[0]?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [location.pathname]);

  return (
    <>
      <ProfessionalServiceMicrodata />

      <Routes>
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
      </Routes>

      <Footer />

      <ToastContainer position="top-center" />
    </>
  );
};
