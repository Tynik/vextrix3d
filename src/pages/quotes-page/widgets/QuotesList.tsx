import React from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { HoneyBox, HoneyGrid, HoneyGridColumn, HoneyList } from '@react-hive/honey-layout';

import { QUOTES_QUERY_KEY } from '~/configs';
import { getQuotes } from '~/api';
import { useAppContext } from '~/models';
import { EmptyContentIllustration } from '~/illustrations';
import { Alert, Progress } from '~/components';
import { QuoteRow } from './QuoteRow';

export const QuotesList = () => {
  const { user } = useAppContext();

  const {
    data: quotes,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: [QUOTES_QUERY_KEY],
    queryFn: () => getQuotes({}),
    placeholderData: keepPreviousData,
    enabled: Boolean(user),
  });

  if (isError) {
    return <Alert severity="error">Failed to fetch quotes</Alert>;
  }

  if (isLoading) {
    return <Progress $margin="auto" />;
  }

  if (quotes?.data.length === 0) {
    return <EmptyContentIllustration $margin="auto" />;
  }

  return (
    <HoneyGrid columns={2} spacing={2}>
      <HoneyGridColumn>
        <HoneyList
          items={quotes?.data}
          loading={isFetching}
          loadingOverContent={true}
          loadingContent={
            <HoneyBox $position="absolute" $inset={0}>
              <HoneyBox
                $position="absolute"
                $inset={0}
                $backgroundColor="neutral.grayDark"
                $opacity={0.05}
              />

              <Progress
                $position="absolute"
                $left="50%"
                $top="50%"
                $transform="translate(-50%, -50%)"
              />
            </HoneyBox>
          }
          itemKey="id"
          $position="relative"
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
