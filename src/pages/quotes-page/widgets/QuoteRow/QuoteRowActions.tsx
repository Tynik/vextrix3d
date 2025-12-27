import React, { useCallback, useState } from 'react';
import type { HoneyFlexProps } from '@react-hive/honey-layout';
import { HoneyFlex } from '@react-hive/honey-layout';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import type { Quote } from '~/netlify/types';
import { QUOTES_QUERY_KEY } from '~/configs';
import { acceptQuote, handleApiError, rejectQuote } from '~/api';
import { useAppContext } from '~/models';
import { ThumbDownIcon, ThumbUpIcon } from '~/icons';
import { Button } from '~/components';
import { ConfirmationDialog } from '~/pages';
import { ProcessQuoteButton } from '../ProcessQuoteButton';

interface QuoteRowActionsProps extends HoneyFlexProps {
  quote: Quote;
}

export const QuoteRowActions = ({ quote, ...props }: QuoteRowActionsProps) => {
  const queryClient = useQueryClient();

  const { user, isAdmin } = useAppContext();

  const acceptQuoteMutation = useMutation({
    mutationFn: acceptQuote,
  });

  const rejectQuoteMutation = useMutation({
    mutationFn: rejectQuote,
  });

  const [isRejectQuote, setIsRejectQuote] = useState(false);

  const cancelRejectQuote = useCallback(() => {
    setIsRejectQuote(false);
  }, []);

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

  const isQuoteOwner = user?.id === quote.requester?.userId;

  const isQuoteCanBeAccepted = isQuoteOwner && quote.status === 'priced';
  const isQuoteCanBeRejected =
    (isAdmin && quote.status === 'new') || (isQuoteOwner && quote.status === 'priced');

  return (
    <HoneyFlex row centerY $gap={1} {...props}>
      {isAdmin && quote.status === 'new' && <ProcessQuoteButton quote={quote} />}

      {isQuoteCanBeAccepted && (
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

      {isQuoteCanBeRejected && (
        <>
          <Button
            loading={rejectQuoteMutation.isPending}
            disabled={acceptQuoteMutation.isPending}
            onClick={() => setIsRejectQuote(true)}
            variant="danger"
            icon={<ThumbDownIcon color="neutral.white" />}
          >
            Reject
          </Button>

          <ConfirmationDialog
            open={isRejectQuote}
            loading={rejectQuoteMutation.isPending}
            onConfirm={handleRejectQuote}
            onClose={cancelRejectQuote}
            severity="danger"
            title={`Reject Quote #${quote.quoteNumber}`}
          >
            Do you really want to reject this quote?
          </ConfirmationDialog>
        </>
      )}
    </HoneyFlex>
  );
};
