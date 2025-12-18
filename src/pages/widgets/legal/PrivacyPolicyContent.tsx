import React from 'react';
import { HoneyFlex } from '@react-hive/honey-layout';

import { LEGAL_DOCUMENTS } from '~/configs';
import { Text } from '~/components';

export const PrivacyPolicyContent = () => {
  return (
    <HoneyFlex $gap={1}>
      <Text variant="body1">
        This Privacy Policy explains how Vextrix3D collects, uses, stores, and protects your
        personal data when you use our website and services. By creating an account, submitting
        files, or placing an order, you acknowledge this Privacy Policy.
      </Text>

      <Text variant="body1">
        We are committed to handling your personal data in accordance with applicable data
        protection laws, including the UK General Data Protection Regulation (UK GDPR).
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        1. Information we collect
      </Text>

      <Text variant="body1">
        We may collect personal information that you provide directly to us, including your name,
        email address, phone number, account details, order information, and any files or designs
        you upload for 3D printing.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        2. How we use your information
      </Text>

      <Text variant="body1">
        We use your information to create and manage user accounts, process quote requests and
        orders, communicate with you regarding your requests, provide customer support, and comply
        with legal and accounting obligations.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        3. Uploaded files and designs
      </Text>

      <Text variant="body1">
        Uploaded 3D model files are used solely for order fulfilment and related customer support.
        Files are stored securely and retained for a limited period, typically up to 30 days after
        order completion, unless you request earlier deletion or extended retention.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        4. Data sharing and third-party services
      </Text>

      <Text variant="body1">
        We may share personal data with trusted third-party service providers for purposes such as
        website hosting, file storage, payment processing, and email delivery. These providers are
        required to process data securely and only for the services they provide to us.
      </Text>

      <Text variant="body1">
        We do not sell, rent, or trade your personal data to third parties.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        5. Data retention
      </Text>

      <Text variant="body1">
        Personal data is retained only for as long as necessary to fulfil the purposes described in
        this policy or as required by law. Account and order records may be retained for legal and
        accounting purposes.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        6. Your rights
      </Text>

      <Text variant="body1">
        You have the right to request access to, correction of, or deletion of your personal data.
        You may also object to or restrict certain processing activities and withdraw consent where
        applicable.
      </Text>

      <Text
        variant="body2"
        $color="secondary.slateAlloy"
        $fontStyle="italic"
        $textAlign="right"
        $marginTop={2}
      >
        Last updated: {LEGAL_DOCUMENTS.privacyPolicy.version}
      </Text>
    </HoneyFlex>
  );
};
