import React from 'react';
import { HoneyFlex } from '@react-hive/honey-layout';

import { LEGAL_DOCUMENTS } from '~/configs';
import { Text } from '~/components';

export const TermsOfServiceContent = () => {
  return (
    <HoneyFlex $gap={1}>
      <Text variant="body1">
        These Terms of Service (“Terms”) govern your access to and use of the Vextrix3D website and
        services. By creating an account, submitting files, or placing an order, you confirm that
        you have read, understood, and agree to be bound by these Terms.
      </Text>

      <Text variant="body1">
        These Terms apply together with our Model Submission Policy, Refund Policy, Shipping Policy,
        and Material Safety Disclaimer. Where policies conflict, these Terms take precedence.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        1. Use of the service
      </Text>

      <Text variant="body1">
        Vextrix3D provides on-demand FDM 3D printing and related services. You may submit digital 3D
        files for manufacturing subject to these Terms and our published policies.
      </Text>

      <Text variant="body1">
        We reserve the right, at our sole discretion, to refuse, suspend, or cancel any order or
        service request that is unlawful, unsafe, violates intellectual property rights, or breaches
        our policies.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        2. Orders, pricing & payment
      </Text>

      <Text variant="body1">
        Orders are accepted only after full payment is received. All prices displayed are for custom
        manufacturing services and may include printing, basic post-print inspection, and packaging
        unless stated otherwise.
      </Text>

      <Text variant="body1">
        Prices may change without notice. Custom quotes may apply for complex, large, or specialised
        jobs. Applicable taxes, shipping fees, and additional services are calculated at checkout.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        3. Cancellations & changes
      </Text>

      <Text variant="body1">
        Because items are custom-made, orders may only be cancelled or modified before the printing
        or post-processing stage begins. Once production has started, cancellations, changes, or
        refunds are not guaranteed and may incur fees.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        4. Prohibited content & designs
      </Text>

      <Text variant="body1">
        You may not submit designs intended to produce weapons, weapon components, illegal items,
        counterfeit goods, or content that promotes violence, hate, or discrimination.
      </Text>

      <Text variant="body1">
        Vextrix3D may refuse to print any design that presents a legal, ethical, or safety risk,
        without obligation to provide a detailed explanation.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        5. Quality, liability & warranties
      </Text>

      <Text variant="body1">
        Vextrix3D performs reasonable quality checks and will address verified manufacturing defects
        in accordance with our Refund & Reprint Policy.
      </Text>

      <Text variant="body1">
        Printed parts are supplied “as-is” and are not certified for medical, safety-critical,
        load-bearing, or regulated applications unless explicitly agreed in writing. We make no
        guarantees regarding fitness for a particular purpose.
      </Text>

      <Text variant="body1">
        To the maximum extent permitted by law, Vextrix3D shall not be liable for indirect,
        incidental, special, or consequential damages, including loss of profits, misuse of printed
        parts, or failures arising from customer-provided designs.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        6. Governing law
      </Text>

      <Text variant="body1">
        These Terms are governed by and construed in accordance with the laws of the United Kingdom.
        Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the
        competent courts of the United Kingdom.
      </Text>

      <Text
        variant="body2"
        $color="secondary.slateAlloy"
        $fontStyle="italic"
        $textAlign="right"
        $marginTop={2}
      >
        Last updated: {LEGAL_DOCUMENTS.termsOfService.version}
      </Text>
    </HoneyFlex>
  );
};
