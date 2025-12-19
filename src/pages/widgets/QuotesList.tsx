import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { HoneyList } from '@react-hive/honey-layout';

import { getQuotes } from '~/api';
import { useAppContext } from '~/models';
import { Progress } from '~/components';
import { QuoteRow } from '~/pages/widgets/QuoteRow';

export const QuotesList = () => {
  const { user } = useAppContext();

  const { data: quotes, isLoading: isQuotesLoading } = useQuery({
    queryKey: ['quotes'],
    queryFn: () => getQuotes({}),
    enabled: Boolean(user),
  });

  if (isQuotesLoading) {
    return <Progress $margin="auto" />;
  }

  return (
    <HoneyList
      items={quotes?.data}
      itemKey="id"
      $gap={1}
      // Data
      data-testid="quotes-list"
    >
      {quote => <QuoteRow quote={quote} />}
    </HoneyList>
  );
};
