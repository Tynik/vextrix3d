import React from 'react';
import { HoneyFlex } from '@react-hive/honey-layout';

import { formateDatetime } from '~/utils';
import type { Quote } from '~/netlify/types';
import { Divider, Text } from '~/components';

interface QuoteProps {
  quote: Quote;
}

export const QuoteRow = ({ quote }: QuoteProps) => {
  return (
    <HoneyFlex
      $gap={1}
      $padding={2}
      $borderRadius="4px"
      $border="1px solid"
      $borderColor="neutral.grayLight"
      $backgroundColor="neutral.white"
    >
      <HoneyFlex row centerY $gap={1}>
        <Text variant="body2" $color="secondary.slateAlloy">
          {formateDatetime(quote.createdAt)}
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
  );
};
