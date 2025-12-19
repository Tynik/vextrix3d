import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { HoneyList } from '@react-hive/honey-layout';

import { getQuotes } from '~/api';
import { useAppContext } from '~/models';
import { EmptyContentIllustration } from '~/illustrations';
import { Progress } from '~/components';
import { QuoteRow } from '~/pages/widgets/QuoteRow';

export const QuotesList = () => {
  const { user } = useAppContext();

  const { data: quotes, isFetching: isQuotesFetching } = useQuery({
    queryKey: ['quotes'],
    queryFn: () => getQuotes({}),
    enabled: Boolean(user),
  });

  if (isQuotesFetching) {
    return <Progress $margin="auto" />;
  }

  return (
    <HoneyList
      items={quotes?.data}
      itemKey="id"
      emptyContent={<EmptyContentIllustration $margin="auto" />}
      $flexGrow={1}
      $gap={1}
      // Data
      data-testid="quotes-list"
    >
      {quote => <QuoteRow quote={quote} />}
    </HoneyList>
  );
};
