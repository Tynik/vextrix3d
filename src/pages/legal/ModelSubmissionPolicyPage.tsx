import React from 'react';

import { CONTACT_EMAIL } from '~/configs';
import { Text } from '~/components';
import { ModelSubmissionPolicyContent, Page } from '~/pages';

export const ModelSubmissionPolicyPage = () => {
  return (
    <Page title="Model Submission Policy">
      <ModelSubmissionPolicyContent />

      <Text variant="h6" $marginTop={3}>
        Contact
      </Text>

      <Text variant="body1">
        Questions? Email:{' '}
        <Text as="a" variant="body1" $fontWeight={700} href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </Text>
      </Text>
    </Page>
  );
};
