import React from 'react';
import type { HoneyFlexProps } from '@react-hive/honey-layout';
import { HoneyList } from '@react-hive/honey-layout';
import { useQuery } from '@tanstack/react-query';

import { QUOTE_ORDERS_QUERY_KEY } from '~/configs';
import { getQuoteOrders } from '~/api';
import { Alert, Progress } from '~/components';
import { QuoteOrderRow } from './QuoteOrderRow';

interface QuoteOrdersListProps extends HoneyFlexProps {
  quoteId: string;
}

export const QuoteOrdersList = ({ quoteId, ...props }: QuoteOrdersListProps) => {
  const {
    data: orders,
    isFetching,
    isError,
  } = useQuery({
    queryKey: [QUOTE_ORDERS_QUERY_KEY],
    queryFn: () => getQuoteOrders({ quoteId }),
  });

  if (isError) {
    return <Alert severity="error">Failed to fetch orders.</Alert>;
  }

  if (isFetching) {
    return <Progress $margin="auto" />;
  }

  return (
    <HoneyList
      items={orders?.data}
      itemKey="id"
      $flexGrow={1}
      $gap={1}
      {...props}
      // Data
      data-testid="quote-orders-list"
    >
      {order => <QuoteOrderRow order={order} />}
    </HoneyList>
  );
};
