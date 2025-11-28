import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
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
} from '~/pages';
import { ToastContainer } from 'react-toastify';

export const App = () => {
  const location = useLocation();

  useEffect(() => {
    const htmlElements = document.getElementsByTagName('html');

    htmlElements[0]?.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route path="/terms-of-service" element={<TermsOfServicePage />} />
        <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/model-submission-policy" element={<ModelSubmissionPolicyPage />} />
        <Route path="/material-safety-disclaimer" element={<MaterialSafetyDisclaimerPage />} />
        <Route path="/intellectual-property-policy" element={<IntellectualPropertyPolicyPage />} />
        <Route path="/quote-request" element={<QuoteRequestPage />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>

      <Footer />

      <ToastContainer position="bottom-center" />
    </>
  );
};
