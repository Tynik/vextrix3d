import React from 'react';

import { Page, QuotesList } from '~/pages';

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
