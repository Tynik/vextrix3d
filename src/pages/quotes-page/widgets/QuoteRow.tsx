import React, { useMemo, useState } from 'react';
import type { HoneyFlexProps } from '@react-hive/honey-layout';
import { HoneyFlex } from '@react-hive/honey-layout';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { QUOTES_QUERY_KEY } from '~/configs';
import { acceptQuote, handleApiError, rejectQuote } from '~/api';
import { formatCurrency, formatDatetime } from '~/utils';
import type { Quote } from '~/netlify/types';
import { useAppContext } from '~/models';
import { DownloadIcon, ThumbDownIcon, ThumbUpIcon } from '~/icons';
import type { InfoTableRow } from '~/components';
import { Button, Divider, InfoTable, Text, Link } from '~/components';
import { QuoteStatusInfo } from './QuoteStatus';
import { ProcessQuoteButton } from './ProcessQuoteButton';
import { QuoteOrdersList } from './QuoteOrdersList';

interface QuoteProps extends HoneyFlexProps {
  quote: Quote;
}

export const QuoteRow = ({ quote, ...props }: QuoteProps) => {
  const queryClient = useQueryClient();

  const { isAdmin } = useAppContext();

  const acceptQuoteMutation = useMutation({
    mutationFn: acceptQuote,
  });

  const rejectQuoteMutation = useMutation({
    mutationFn: rejectQuote,
  });

  const [isViewOrders, setIsViewOrders] = useState(false);

  const handleAcceptQuote = async () => {
    try {
      await acceptQuoteMutation.mutateAsync({
        quoteId: quote.id,
      });

      toast('Quote successfully accepted', {
        type: 'success',
      });

      await queryClient.invalidateQueries({
        queryKey: [QUOTES_QUERY_KEY],
      });
    } catch (e) {
      handleApiError(e);
    }
  };

  const handleRejectQuote = async () => {
    try {
      await rejectQuoteMutation.mutateAsync({
        quoteId: quote.id,
      });

      toast('Quote successfully rejected', {
        type: 'success',
      });

      await queryClient.invalidateQueries({
        queryKey: [QUOTES_QUERY_KEY],
      });
    } catch (e) {
      handleApiError(e);
    }
  };

  const infoTableRows = useMemo<InfoTableRow[]>(
    () => [
      {
        label: 'File name',
        value: quote.model.fileName,
      },
      {
        label: 'Submitted on',
        value: formatDatetime(quote.createdAt),
      },
    ],
    [quote],
  );

  const isOrdersCanBeViewed =
    quote.status === 'accepted' || quote.status === 'inProduction' || quote.status === 'completed';

  return (
    <HoneyFlex
      onClick={() => isOrdersCanBeViewed && setIsViewOrders(!isViewOrders)}
      $gap={1}
      $padding={2}
      $borderRadius="4px"
      $border="1px solid"
      $borderColor="neutral.grayLight"
      $backgroundColor="neutral.white"
      $cursor={isOrdersCanBeViewed ? 'pointer' : undefined}
      {...props}
    >
      <HoneyFlex row centerY $gap={1} $flexWrap="wrap">
        <Text variant="body1" $fontWeight={700} $whiteSpace="nowrap">
          #{quote.quoteNumber}
        </Text>

        <QuoteStatusInfo status={quote.status} />

        {quote.pricing && (
          <HoneyFlex row centerY $gap={1} $marginLeft="auto">
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
        rowProps={{
          $width: '100%',
          $maxWidth: '90px',
          $color: 'neutral.grayMedium',
        }}
      />

      <HoneyFlex row $gap={1} $flexWrap="wrap" $marginTop={1}>
        {isAdmin && (
          <Link to={quote.model.fileUrl} variant="body2">
            <Button variant="secondary" icon={<DownloadIcon color="neutral.white" />}>
              Download
            </Button>
          </Link>
        )}

        <HoneyFlex row centerY $gap={1} $marginLeft="auto">
          {quote.status === 'new' && <ProcessQuoteButton quote={quote} />}

          {quote.status === 'priced' && (
            <Button
              loading={acceptQuoteMutation.isPending}
              disabled={rejectQuoteMutation.isPending}
              onClick={handleAcceptQuote}
              variant="success"
              icon={<ThumbUpIcon color="neutral.white" />}
            >
              Accept
            </Button>
          )}

          {((isAdmin && quote.status === 'new') || quote.status === 'priced') && (
            <Button
              loading={rejectQuoteMutation.isPending}
              disabled={acceptQuoteMutation.isPending}
              onClick={handleRejectQuote}
              variant="danger"
              icon={<ThumbDownIcon color="neutral.white" />}
            >
              Reject
            </Button>
          )}
        </HoneyFlex>
      </HoneyFlex>

      {isViewOrders && <QuoteOrdersList quoteId={quote.id} $marginTop={1} />}
    </HoneyFlex>
  );
};
