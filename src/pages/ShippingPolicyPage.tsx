import React from 'react';

import { CONTACT_EMAIL } from '~/configs';
import { Text } from '~/components';
import { Page } from './sections';

export const ShippingPolicyPage = () => {
  return (
    <Page title="Shipping & Delivery Policy">
      <Text variant="subtitle1">Processing time</Text>

      <Text variant="body1">
        Typical processing time is 1-3 business days for small/standard prints. Larger or complex
        jobs may require up to 7 business days. Expedited options may be available at checkout.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        Carriers & tracking
      </Text>

      <Text variant="body1">
        We ship via reputable carriers (e.g., Royal Mail, DPD). Tracking numbers are provided when
        dispatch is confirmed.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        Shipping costs
      </Text>

      <Text variant="body1">
        Shipping costs are calculated at checkout based on weight, destination, and chosen service
        level. Local pickup may be offered where available.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        Lost or damaged parcels
      </Text>

      <Text variant="body1">
        If your item arrives damaged, photograph the package and contents and contact us within 48
        hours at{' '}
        <Text as="a" variant="body1" $fontWeight={700} href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </Text>
        . We will assist with claims against the carrier. Liability passes to the buyer once the
        parcel is marked delivered by the carrier, except where damage during transit is verified.
      </Text>

      <Text
        variant="body2"
        $color="secondary.slateAlloy"
        $fontStyle="italic"
        $textAlign="right"
        $marginTop={2}
      >
        Last updated: 12/11/2025
      </Text>
    </Page>
  );
};
