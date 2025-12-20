import React, { useMemo } from 'react';
import type { HoneyFlexProps } from '@react-hive/honey-layout';
import { HoneyFlex } from '@react-hive/honey-layout';

import { formatCurrency, formatDatetime } from '~/utils';
import type { Quote } from '~/netlify/types';
import type { InfoTableRow } from '~/components';
import { Divider, InfoTable, Text } from '~/components';
import { QuoteStatusInfo } from './QuoteStatus';

interface QuoteProps extends HoneyFlexProps {
  quote: Quote;
}

export const QuoteRow = ({ quote, ...props }: QuoteProps) => {
  const infoTableRows = useMemo<InfoTableRow[]>(
    () => [
      {
        label: 'Technology',
        value: quote.job.technology,
      },
      {
        label: 'Quantity',
        value: quote.job.quantity,
      },
      {
        label: 'Submitted',
        value: formatDatetime(quote.createdAt),
      },
    ],
    [quote],
  );

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
        <QuoteStatusInfo status={quote.status} />

        {quote.pricing && (
          <Text variant="body1" $fontWeight={700} ellipsis $marginLeft="auto">
            {formatCurrency(quote.pricing.total)}
          </Text>
        )}
      </HoneyFlex>

      <Divider />

      <HoneyFlex row centerY $gap={1}>
        <Text variant="subtitle1" ellipsis>
          {quote.model.fileName}
        </Text>
      </HoneyFlex>

      <InfoTable
        rows={infoTableRows}
        textVariant="body2"
        rowProps={{
          $width: '100%',
          $maxWidth: '70px',
          $color: 'neutral.grayMedium',
        }}
      />
    </HoneyFlex>
  );
};
