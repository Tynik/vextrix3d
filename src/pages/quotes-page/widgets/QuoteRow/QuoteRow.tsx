import React, { useMemo, useState } from 'react';
import type { HoneyFlexProps } from '@react-hive/honey-layout';
import { HoneyFlex } from '@react-hive/honey-layout';

import { formatCurrency } from '~/shared';
import { formatDatetime } from '~/utils';
import type { Quote } from '~/netlify/types';
import { useAppContext } from '~/models';
import { DownloadIcon, KeyboardDoubleArrowDownIcon } from '~/icons';
import type { InfoTableRow } from '~/components';
import { IconButton, Divider, InfoTable, Text, Link } from '~/components';
import { QuoteStatusInfo } from '../QuoteStatus';
import { QuoteOrdersList } from '../QuoteOrdersList';
import { QuoteRowActions } from './QuoteRowActions';

interface QuoteProps extends HoneyFlexProps {
  quote: Quote;
}

export const QuoteRow = ({ quote, ...props }: QuoteProps) => {
  const { isAdmin } = useAppContext();

  const [isViewOrders, setIsViewOrders] = useState(false);

  const infoTableRows = useMemo<InfoTableRow[]>(
    () => [
      {
        label: 'Requester',
        visible: isAdmin,
        value: quote.requester?.userId ? 'User' : 'Guest',
      },
      {
        label: 'Email',
        visible: isAdmin && Boolean(quote.requester?.guest),
        value: quote.requester?.guest?.email,
      },
      {
        label: 'File name',
        value: (
          <HoneyFlex row centerY $gap={1} $overflow="hidden">
            <Text variant="inherit" ellipsis>
              {quote.model.fileName}
            </Text>

            {isAdmin && (
              <Link to={quote.model.fileUrl} variant="body2">
                <IconButton
                  icon={<DownloadIcon />}
                  iconProps={{
                    size: 'small',
                    color: 'secondary.slateAlloy',
                  }}
                />
              </Link>
            )}
          </HoneyFlex>
        ),
      },
      {
        label: 'Submitted on',
        value: formatDatetime(quote.createdAt),
      },
      {
        label: 'Description',
        value: quote.job.description,
      },
    ],
    [quote],
  );

  const isOrdersCanBeViewed =
    quote.status === 'accepted' || quote.status === 'inProduction' || quote.status === 'completed';

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
      <HoneyFlex row centerY $gap={1} $justifyContent="space-between">
        <HoneyFlex row centerY $gap={1}>
          <Text variant="body1" $fontWeight={700} $whiteSpace="nowrap">
            #{quote.quoteNumber}
          </Text>

          <QuoteStatusInfo status={quote.status} />
        </HoneyFlex>

        {quote.status !== 'new' && quote.pricing && (
          <HoneyFlex row centerY $gap={1}>
            <Text variant="body1" $fontWeight={700}>
              {formatCurrency(quote.pricing.total)}
            </Text>

            {quote.pricing.discountAmount > 0 && (
              <Text variant="body1" $color="success.emeraldGreen">
                (-{formatCurrency(quote.pricing.discountAmount)})
              </Text>
            )}

            {quote.pricing.vatPct > 0 && (
              <Text variant="body2" $color="neutral.grayMedium">
                VAT: {quote.pricing.vatPct}%
              </Text>
            )}
          </HoneyFlex>
        )}
      </HoneyFlex>

      <Divider />

      <HoneyFlex row centerY $gap={1}>
        <Text variant="body2">
          {[quote.job.technology, quote.job.material, `Qty: ${quote.job.quantity}`]
            .filter(Boolean)
            .join(' | ')}
        </Text>
      </HoneyFlex>

      <InfoTable
        rows={infoTableRows}
        textVariant="body2"
        rowLabelProps={{
          $width: '100%',
          $maxWidth: '90px',
          $flexShrink: 0,
          $color: 'neutral.grayMedium',
        }}
      />

      <QuoteRowActions quote={quote} $marginTop={1} $marginLeft="auto" />

      {isOrdersCanBeViewed && (
        <HoneyFlex $gap={1}>
          <Text variant="body1" $fontWeight={500}>
            Orders
          </Text>

          {!isViewOrders && (
            <IconButton
              onClick={() => setIsViewOrders(true)}
              icon={<KeyboardDoubleArrowDownIcon color="secondary.slateAlloy" />}
              $margin={[0, 'auto']}
            />
          )}

          {isViewOrders && <QuoteOrdersList quoteId={quote.id} />}
        </HoneyFlex>
      )}
    </HoneyFlex>
  );
};
