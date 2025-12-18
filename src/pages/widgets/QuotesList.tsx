import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { HoneyFlex, HoneyList } from '@react-hive/honey-layout';

import { getQuotes } from '~/api';
import { useAppContext } from '~/models';
import { Divider, Progress, Text } from '~/components';

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
      $marginTop={2}
      // Data
      data-testid="quotes-list"
    >
      {quote => (
        <HoneyFlex
          key={quote.id}
          $gap={1}
          $borderRadius="4px"
          $border="1px solid"
          $borderColor="neutral.grayLight"
          $padding={2}
        >
          <HoneyFlex row centerY $gap={1}>
            <Text variant="body2" $color="secondary.slateAlloy">
              {new Intl.DateTimeFormat('en-GB', {
                dateStyle: 'medium',
                timeStyle: 'short',
              }).format(new Date(quote.createdAt))}
            </Text>

            <Text variant="body2" $marginLeft="auto">
              {quote.status}
            </Text>
          </HoneyFlex>

          <Divider />

          <HoneyFlex row centerY $gap={1}>
            <Text variant="subtitle2" ellipsis>
              {quote.model.fileName}
            </Text>
          </HoneyFlex>

          <HoneyFlex row centerY $gap={1}>
            <Text variant="body2" ellipsis>
              Quantity: {quote.job.quantity}
            </Text>
          </HoneyFlex>
        </HoneyFlex>
      )}
    </HoneyList>
  );
};
