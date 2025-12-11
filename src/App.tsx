import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';

import { SIGN_IN_ROUTE_PATH, SIGN_UP_ROUTE_PATH } from '~/configs';
import { getCookieValue } from '~/utils';
import { ProfessionalServiceMicrodata } from '~/seo';
import type { VerifyIdTokenRequestError } from '~/api';
import { verifyIdToken } from '~/api';
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

  const idToken = getCookieValue('idToken');

  useQuery({
    queryKey: ['verify-id-token', idToken],
    queryFn: async () => {
      try {
        return await verifyIdToken();
      } catch (e) {
        const error = e as VerifyIdTokenRequestError;

        if (error.data.error.name === 'Error') {
          const redirectPath = encodeURIComponent(location.pathname + location.search);

          return navigate(`${SIGN_IN_ROUTE_PATH}?redirect=${redirectPath}`);
        }

        return Promise.reject(error);
      }
    },
    refetchInterval: 900000, // 15 minutes
    refetchIntervalInBackground: true,
    enabled: Boolean(idToken),
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
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/model-submission-policy" element={<ModelSubmissionPolicyPage />} />
        <Route path="/material-safety-disclaimer" element={<MaterialSafetyDisclaimerPage />} />
        <Route path="/intellectual-property-policy" element={<IntellectualPropertyPolicyPage />} />
        <Route path="/quote-request" element={<QuoteRequestPage />} />
        <Route path={SIGN_UP_ROUTE_PATH} element={<SignUpPage />} />
        <Route path={SIGN_IN_ROUTE_PATH} element={<SignInPage />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>

      <Footer />

      <ToastContainer position="top-center" />
    </>
  );
};
