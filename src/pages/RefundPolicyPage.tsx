import React from 'react';

import { CONTACT_EMAIL } from '~/configs';
import { Text } from '~/components';
import { Page } from './sections';

export const RefundPolicyPage = () => {
  return (
    <Page title="Refund & Reprint Policy">
      <Text variant="body1" $marginTop={2}>
        Vextrix3D aims to deliver prints that match your expectations. Due to the custom nature of
        3D prints, refunds are limited and handled case-by-case.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        When we offer refunds or reprints
      </Text>

      <Text variant="body1">We will offer a free reprint or refund if:</Text>

      <ul>
        <li>
          <Text variant="body1">
            The part has a clear manufacturing defect (layer separation, major extrusion failure).
          </Text>
        </li>
        <li>
          <Text variant="body1">
            The delivered item is materially different from the approved order.
          </Text>
        </li>
        <li>
          <Text variant="body1">
            Items are damaged in transit and damage is reported within 48 hours with photos.
          </Text>
        </li>
      </ul>

      <Text variant="subtitle1" $marginTop={2}>
        When refunds are not provided
      </Text>

      <Text variant="body1">Refunds/reprints are typically not provided for:</Text>

      <ul>
        <li>
          <Text variant="body1">
            Design errors (incorrect dimensions, weak geometry) unless we accepted responsibility.
          </Text>
        </li>
        <li>
          <Text variant="body1">
            Normal cosmetic variations (minor layer lines, small surface blemishes).
          </Text>
        </li>
        <li>
          <Text variant="body1">Customer-caused damage after delivery or misuse of parts.</Text>
        </li>
      </ul>

      <Text variant="subtitle1" $marginTop={2}>
        How to request a reprint or refund
      </Text>

      <Text variant="body1">
        Email{' '}
        <Text as="a" variant="body1" $fontWeight={700} href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </Text>{' '}
        with your order number, a description of the issue, and photos. We will review and respond
        within 3 business days.
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
