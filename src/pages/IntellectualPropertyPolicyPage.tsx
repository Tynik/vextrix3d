import React from 'react';
import { Page } from '~/pages/sections';
import { Text } from '~/components';
import { CONTACT_EMAIL } from '~/configs';

export const IntellectualPropertyPolicyPage = () => {
  return (
    <Page title="Intellectual Property & Copyright">
      <Text variant="subtitle1" $marginTop={2}>
        Customer-owned content
      </Text>

      <Text variant="body1">
        Customers retain ownership of the 3D models they submit. By submitting a file, you grant
        Vextrix3D a non-exclusive, limited right to process and print the file for order
        fulfillment.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        Third-party rights
      </Text>

      <Text variant="body1">
        You warrant that you own or are licensed to print submitted designs. You agree to indemnify
        Vextrix3D against claims arising from IP infringement of uploaded content.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        Use of our content
      </Text>

      <Text variant="body1">
        Vextrix3D retains rights to website content, branding, photos, and documentation.
        Reproduction or redistribution of our content requires written permission.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        Reporting infringement
      </Text>

      <Text variant="body1">
        If you believe your copyrighted work has been used in a way that constitutes copyright
        infringement, please contact us at{' '}
        <Text as="a" variant="body1" $fontWeight={700} href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </Text>{' '}
        with sufficient detail to allow us to investigate.
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
