import React from 'react';

import { CONTACT_EMAIL } from '~/configs';
import { Text } from '~/components';
import { Page } from './sections';

export const ShippingPolicyPage = () => {
  return (
    <Page title="Shipping & Delivery Policy">
      <Text variant="subtitle1">Order processing & dispatch</Text>

      <Text variant="body1">
        All orders are custom-manufactured and require processing time before dispatch. Typical
        processing times are 1–3 business days for small or standard prints. Larger, complex, or
        multi-part orders may require up to 7 business days.
      </Text>

      <Text variant="body1">
        Processing and delivery timeframes are estimates only and are not guaranteed. Expedited
        production or shipping options may be available at checkout where applicable.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        Shipping carriers & tracking
      </Text>

      <Text variant="body1">
        Orders are shipped via reputable carriers such as Royal Mail or DPD. Once your order is
        dispatched, a tracking number will be provided by email where supported by the carrier.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        Shipping costs
      </Text>

      <Text variant="body1">
        Shipping costs are calculated at checkout based on package size, weight, destination, and
        selected service level. Local collection may be offered where available and confirmed prior
        to order completion.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        Lost, delayed, or damaged parcels
      </Text>

      <Text variant="body1">
        If your order arrives damaged, please retain the original packaging and contact us within 48
        hours of delivery at{' '}
        <Text as="a" variant="body1" $fontWeight={700} href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </Text>
        , including photographs of the parcel and contents. We will assist with initiating a claim
        with the shipping carrier where applicable.
      </Text>

      <Text variant="body1">
        Responsibility for the shipment transfers to the customer once the carrier marks the parcel
        as delivered. Vextrix3D is not responsible for delays, loss, or delivery issues caused by
        the carrier, incorrect delivery information provided by the customer, or failed delivery
        attempts, except where damage during transit is verified.
      </Text>

      <Text
        variant="body2"
        $color="secondary.slateAlloy"
        $fontStyle="italic"
        $textAlign="right"
        $marginTop={2}
      >
        Last updated: 17/12/2025
      </Text>
    </Page>
  );
};
