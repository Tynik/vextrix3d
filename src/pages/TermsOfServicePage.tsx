import React from 'react';
import { Page } from '~/pages/sections';
import { Text } from '~/components';
import { CONTACT_EMAIL } from '~/configs';

export const TermsOfServicePage = () => {
  return (
    <Page>
      <Text variant="h3">Terms of Service</Text>

      <Text variant="body2">Last updated: 12/11/2025</Text>

      <Text variant="body1" $marginTop={2}>
        These Terms of Service govern your use of Vextrix3D's website and printing services. By
        placing an order or using the site, you agree to these terms.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        1. Use of Service
      </Text>

      <Text variant="body1">
        Vextrix3D provides on-demand FDM 3D printing services. You may submit digital 3D files for
        printing subject to these Terms and our Model Submission Policy. We reserve the right to
        refuse service for any design that is unlawful, unsafe, or violates our policies.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        2. Orders, Pricing & Payments
      </Text>

      <Text variant="body1">
        Orders are accepted once payment is confirmed. Prices shown on the site include printing,
        basic post-print checks, and packaging unless stated otherwise. Custom quotes may apply for
        complex jobs. Taxes and shipping costs will be added at checkout.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        3. Cancellations & Changes
      </Text>

      <Text variant="body1">
        Orders can be cancelled or changed only before the printing process begins. Once a print job
        has started, cancellation is not guaranteed and may be subject to fees.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        4. Prohibited Items
      </Text>

      <Text variant="body1">
        We will not print weapons, illicit or counterfeit items, or material that promotes hate or
        violence. We may refuse any design that is illegal or presents a safety risk.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        5. Liability & Warranty
      </Text>

      <Text variant="body1">
        Vextrix3D performs reasonable quality checks and will reprint or refund in cases of clear
        manufacturing defects. We are not liable for indirect, incidental, or consequential damages,
        product misuse, or failure where the design itself is at fault. Printed parts are supplied
        “as-is” unless a written specification or warranty is provided.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        6. Governing Law
      </Text>

      <Text variant="body1">
        These Terms are governed by the laws of the United Kingdom. Any disputes will be subject to
        the competent courts of the UK.
      </Text>

      <Text variant="h6" $marginTop={3}>
        Contact
      </Text>

      <Text variant="body1">
        Questions about these Terms? Email:{' '}
        <Text as="a" variant="body1" $fontWeight={700} href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </Text>
      </Text>
    </Page>
  );
};
