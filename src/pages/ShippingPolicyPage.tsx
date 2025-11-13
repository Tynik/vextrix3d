import React from 'react';
import { Page } from '~/pages/sections';
import { Text } from '~/components';

export const ShippingPolicyPage = () => {
  return (
    <Page>
      <Text variant="h3">Shipping & Delivery Policy</Text>

      <Text variant="body2">Last updated: Last updated: 12/11/2025</Text>

      <Text variant="subtitle1" $marginTop={2}>
        Processing time
      </Text>

      <Text variant="body1">
        Typical processing time is 1–3 business days for small/standard prints. Larger or complex
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
        <Text as="a" variant="body1" $fontWeight={700} href="mailto:m.aliynik@gmail.com">
          m.aliynik@gmail.com
        </Text>
        . We will assist with claims against the carrier. Liability passes to the buyer once the
        parcel is marked delivered by the carrier, except where damage during transit is verified.
      </Text>
    </Page>
  );
};
