import React from 'react';

import { CONTACT_EMAIL } from '~/configs';
import { MaterialSafetyDisclaimerContent, Page } from '~/pages';
import { Text } from '~/components';

export const MaterialSafetyDisclaimerPage = () => {
  return (
    <Page title="Material Safety & Print Quality Disclaimer">
      <MaterialSafetyDisclaimerContent />

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
