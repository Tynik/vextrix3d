import React from 'react';

import { CONTACT_EMAIL } from '~/configs';
import { Text } from '~/components';
import { Page, TermsOfServiceContent } from '~/pages';

export const TermsOfServicePage = () => {
  return (
    <Page title="Terms of Service">
      <TermsOfServiceContent />

      <Text variant="h6" $marginTop={3}>
        Contact
      </Text>

      <Text variant="body1">
        If you have questions about these Terms, please contact us at{' '}
        <Text as="a" variant="body1" $fontWeight={700} href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </Text>
        .
      </Text>
    </Page>
  );
};
