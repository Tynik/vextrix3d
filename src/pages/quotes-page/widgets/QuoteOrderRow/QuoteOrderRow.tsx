import React from 'react';
import type { HoneyFlexProps } from '@react-hive/honey-layout';
import { HoneyFlex } from '@react-hive/honey-layout';

import type { Order } from '~/netlify/types';
import { formatCurrency } from '~/shared';
import { Text } from '~/components';
import { PayOrderButton } from './PayOrderButton';
import { QuoteOrderRowStyled } from './QuoteOrderRowStyled';

interface QuoteOrderRowProps extends HoneyFlexProps {
  order: Order;
}

export const QuoteOrderRow = ({ order }: QuoteOrderRowProps) => {
  return (
    <QuoteOrderRowStyled status={order.status} onClick={e => e.stopPropagation()}>
      <HoneyFlex row centerY $gap={1}>
        <Text variant="body1" $fontWeight={700} $whiteSpace="nowrap">
          #{order.orderNumber}
        </Text>

        <Text variant="body2" $fontWeight={500}>
          [{order.status.toUpperCase()}]
        </Text>

        {order.status === 'new' && Boolean(order.payment?.paymentIntentId) && (
          <Text variant="body2" $color="warning.orange">
            (UNCOMPLETED)
          </Text>
        )}
      </HoneyFlex>

      <HoneyFlex row centerY $gap={1}>
        <HoneyFlex row centerY $gap={0.5}>
          <Text variant="body1">Total:</Text>

          <Text variant="body1" $fontWeight={700}>
            {formatCurrency(order.pricing.total)}
          </Text>
        </HoneyFlex>

        <PayOrderButton order={order} />
      </HoneyFlex>
    </QuoteOrderRowStyled>
  );
};
