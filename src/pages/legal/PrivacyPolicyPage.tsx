import React from 'react';

import { CONTACT_EMAIL } from '~/configs';
import { Page, PrivacyPolicyContent } from '~/pages';
import { Text } from '~/components';

export const PrivacyPolicyPage = () => {
  return (
    <Page title="Privacy Policy">
      <PrivacyPolicyContent />

      <Text variant="h6" $marginTop={3}>
        Contact
      </Text>

      <Text variant="body1">
        If you have questions about this Privacy Policy or wish to exercise your data protection
        rights, please contact us at{' '}
        <Text as="a" variant="body1" $fontWeight={700} href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </Text>
        .
      </Text>
    </Page>
  );
};
