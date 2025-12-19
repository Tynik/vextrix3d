import React from 'react';

import { Page } from '~/pages';
import { QuotesList } from './widgets';

export const QuotesPage = () => {
  return (
    <Page
      title="Quotes"
      contentProps={{
        $gap: 2,
      }}
    >
      <QuotesList />
    </Page>
  );
};
