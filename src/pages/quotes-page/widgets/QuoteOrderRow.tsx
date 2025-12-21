import React from 'react';
import type { HoneyFlexProps } from '@react-hive/honey-layout';
import { HoneyFlex } from '@react-hive/honey-layout';

import { formatCurrency } from '~/utils';
import type { Order, OrderStatus } from '~/netlify/types';
import { Button, Text } from '~/components';

const ORDER_STATUS_GRADIENT: Record<OrderStatus, string> = {
  new: `
    linear-gradient(
      90deg,
      rgba(0, 191, 166, 0.12) 0%,
      rgba(0, 191, 166, 0.04) 35%,
      rgba(0, 191, 166, 0.00) 70%
    )
  `,
  paid: `
    linear-gradient(
      90deg,
      rgba(0, 168, 107, 0.14) 0%,
      rgba(0, 168, 107, 0.05) 35%,
      rgba(0, 168, 107, 0.00) 70%
    )
  `,
  inProduction: `
    linear-gradient(
      90deg,
      rgba(63, 125, 255, 0.14) 0%,
      rgba(63, 125, 255, 0.05) 35%,
      rgba(63, 125, 255, 0.00) 70%
    )
  `,
  shipped: `
    linear-gradient(
      90deg,
      rgba(63, 125, 255, 0.12) 0%,
      rgba(63, 125, 255, 0.04) 35%,
      rgba(63, 125, 255, 0.00) 70%
    )
  `,
  completed: `
    linear-gradient(
      90deg,
      rgba(143, 255, 193, 0.18) 0%,
      rgba(143, 255, 193, 0.07) 35%,
      rgba(143, 255, 193, 0.00) 70%
    )
  `,
  cancelled: `
    linear-gradient(
      90deg,
      rgba(255, 92, 92, 0.12) 0%,
      rgba(255, 92, 92, 0.05) 35%,
      rgba(255, 92, 92, 0.00) 70%
    )
  `,
  refunded: `
    linear-gradient(
      90deg,
      rgba(255, 92, 92, 0.08) 0%,
      rgba(255, 92, 92, 0.03) 35%,
      rgba(255, 92, 92, 0.00) 70%
    )
  `,
  expired: `
    linear-gradient(
      90deg,
      rgba(167, 171, 179, 0.14) 0%,
      rgba(167, 171, 179, 0.05) 35%,
      rgba(167, 171, 179, 0.00) 70%
    )
  `,
};

interface QuoteOrderRowProps extends HoneyFlexProps {
  order: Order;
}

export const QuoteOrderRow = ({ order }: QuoteOrderRowProps) => {
  return (
    <HoneyFlex
      row
      centerY
      $gap={1}
      $padding={1}
      $borderRadius="4px"
      $border="1px solid"
      $borderColor="neutral.grayLight"
      $background={ORDER_STATUS_GRADIENT[order.status]}
      // $hover={{
      //   background: ORDER_STATUS_GRADIENT[order.status].replace('0.00', '0.08'),
      // }}
    >
      <Text variant="body1" $fontWeight={700}>
        {order.orderNumber}
      </Text>

      <Text variant="body2" $fontWeight={500}>
        {order.status}
      </Text>

      <HoneyFlex row centerY $gap={1} $marginLeft="auto">
        <Text variant="body1">Total:</Text>

        <Text variant="body1" $fontWeight={700}>
          {formatCurrency(order.pricing.total)}
        </Text>

        <Button onClick={() => {}} variant="accent" $marginLeft={1}>
          Pay
        </Button>
      </HoneyFlex>
    </HoneyFlex>
  );
};
