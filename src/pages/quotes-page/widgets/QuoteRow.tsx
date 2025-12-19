import React from 'react';
import type { HoneyFlexProps } from '@react-hive/honey-layout';
import { HoneyFlex } from '@react-hive/honey-layout';

import { formateDatetime } from '~/utils';
import type { Quote } from '~/netlify/types';
import { Divider, Text } from '~/components';
import { QuoteStatusInfo } from './QuoteStatus';

interface QuoteProps extends HoneyFlexProps {
  quote: Quote;
}

export const QuoteRow = ({ quote, ...props }: QuoteProps) => {
  return (
    <HoneyFlex
      $gap={1}
      $padding={2}
      $borderRadius="4px"
      $border="1px solid"
      $borderColor="neutral.grayLight"
      $backgroundColor="neutral.white"
      {...props}
    >
      <HoneyFlex row centerY $gap={1}>
        <Text variant="body2" $color="secondary.slateAlloy">
          {formateDatetime(quote.createdAt)}
        </Text>

        <QuoteStatusInfo status={quote.status} $marginLeft="auto" />
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
