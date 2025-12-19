import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { HoneyGrid, HoneyGridColumn, HoneyList } from '@react-hive/honey-layout';

import { getQuotes } from '~/api';
import { useAppContext } from '~/models';
import { EmptyContentIllustration } from '~/illustrations';
import { Progress } from '~/components';
import { QuoteRow } from './QuoteRow';

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
    <HoneyGrid columns={2} spacing={2}>
      <HoneyGridColumn>
        <HoneyList
          items={quotes?.data}
          itemKey="id"
          emptyContent={<EmptyContentIllustration $margin="auto" />}
          $flexGrow={1}
          $gap={1}
          // Data
          data-testid="quotes-list"
        >
          {quote => <QuoteRow quote={quote} $minWidth="300px" />}
        </HoneyList>
      </HoneyGridColumn>

      <HoneyGridColumn />
    </HoneyGrid>
  );
};
