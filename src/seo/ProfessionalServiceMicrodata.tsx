import React from 'react';

import { SEO_SCHEMA_BASE_URL } from '~/configs';

export const ProfessionalServiceMicrodata = () => {
  return (
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
      <meta itemProp="email" content="vextrix3d@gmail.com" />
      <div itemProp="telephone">+447918993712</div>
      <meta itemProp="image" content="https://vextrix3d.co.uk/assets/images/IMG_1700.webp" />

      <div itemProp="brand" itemScope itemType="https://schema.org/Brand">
        <meta itemProp="name" content="Vextrix3D" />
        {/*<meta itemProp="logo" content="https://vextrix3d.co.uk/assets/images/logo.webp" />*/}
      </div>

      <div itemProp="founder" itemScope itemType="https://schema.org/Person">
        <meta itemProp="name" content="Mike Aliinyk" />
        <meta itemProp="jobTitle" content="Founder" />
        <meta itemProp="address" content="Chelmsford, UK" />
      </div>

      <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
        <meta itemProp="addressCountry" content="UK" />
        <meta itemProp="addressLocality" content="Chelmsford" />
        <meta itemProp="addressRegion" content="Essex" />
      </div>

      <div itemProp="geo" itemScope itemType="https://schema.org/GeoCoordinates">
        <meta itemProp="latitude" content="51.7361" />
        <meta itemProp="longitude" content="0.4798" />
      </div>

      <div itemProp="areaServed" itemScope itemType="https://schema.org/Country">
        <meta itemProp="name" content="United Kingdom" />
      </div>

      <meta itemProp="openingHours" content="Mo-Su 09:00-20:00" />

      <meta itemProp="priceRange" content="££" />
      <meta itemProp="currenciesAccepted" content="GBP" />

      <link itemProp="sameAs" href="https://www.instagram.com/vextrix3d" />

      <div itemProp="makesOffer" itemScope itemType="https://schema.org/Offer">
        <div itemProp="itemOffered" itemScope itemType="https://schema.org/Service">
          <meta itemProp="name" content="3D Printing Service" />
          <meta itemProp="serviceType" content="FDM and SLA 3D Printing" />
        </div>
      </div>
    </div>
  );
};
