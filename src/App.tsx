import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { SEO_SCHEMA_BASE_URL } from '~/configs';
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
      <div
        itemType={`${SEO_SCHEMA_BASE_URL}/ProfessionalService`}
        itemScope
        style={{ display: 'none' }}
      >
        <meta itemProp="name" content="Vextrix3D" />
        <meta itemProp="url" content="https://vextrix3d.co.uk" />
        <meta
          itemProp="description"
          content="UK-based professional FDM and SLA 3D printing service offering prototypes, engineering parts, miniatures, and custom high-resolution prints."
        />
        <meta itemProp="image" content="https://vextrix3d.co.uk/assets/images/IMG_1700.webp" />

        <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
          <meta itemProp="addressCountry" content="UK" />
          <meta itemProp="addressLocality" content="Chelmsford" />
          <meta itemProp="addressRegion" content="Essex" />
        </div>

        <div itemProp="areaServed" itemScope itemType="https://schema.org/Country">
          <meta itemProp="name" content="United Kingdom" />
        </div>

        <meta itemProp="priceRange" content="££" />

        <link itemProp="sameAs" href="https://vextrix3d.co.uk" />

        <div itemProp="makesOffer" itemScope itemType="https://schema.org/Offer">
          <div itemProp="itemOffered" itemScope itemType="https://schema.org/Service">
            <meta itemProp="serviceType" content="FDM and SLA 3D Printing" />
          </div>
        </div>
      </div>

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

      <ToastContainer position="top-center" />
    </>
  );
};
