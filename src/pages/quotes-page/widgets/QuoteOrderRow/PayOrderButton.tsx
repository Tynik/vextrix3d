import React, { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HoneyBox } from '@react-hive/honey-layout';
import { Elements } from '@stripe/react-stripe-js';
import { delay } from '@react-hive/honey-utils';
import { toast } from 'react-toastify';

import type { Nullable } from '~/types';
import type { Order } from '~/netlify/types';
import { stripePromise } from '~/stripe';
import { handleApiError, payOrder } from '~/api';
import { AttachMoneyIcon, CloseIcon } from '~/icons';
import { Button, Dialog } from '~/components';
import { QUOTE_ORDERS_QUERY_KEY } from '~/configs';
import { PayOrderForm } from './PayOrderForm';

interface PayOrderButtonProps {
  order: Order;
}

export const PayOrderButton = ({ order }: PayOrderButtonProps) => {
  const queryClient = useQueryClient();

  const payOrderMutation = useMutation({
    mutationFn: payOrder,
  });

  const [clientSecret, setClientSecret] = useState<Nullable<string>>(null);

  const handlePayOrder = async () => {
    try {
      const { clientSecret } = await payOrderMutation.mutateAsync({
        orderId: order.id,
      });

      setClientSecret(clientSecret);
    } catch (e) {
      handleApiError(e);
    }
  };

  const handleClose = useCallback(() => {
    setClientSecret(null);
  }, []);

  const handlePaymentSuccess = async () => {
    await delay(3000);

    toast('Payment successfully processed', {
      type: 'success',
    });

    setClientSecret(null);

    await queryClient.invalidateQueries({
      queryKey: [QUOTE_ORDERS_QUERY_KEY, order.quoteId],
    });
  };

  return (
    <>
      <Button
        loading={payOrderMutation.isPending}
        disabled={Boolean(clientSecret)}
        onClick={handlePayOrder}
        variant="accent"
        size="small"
        icon={<AttachMoneyIcon color="neutral.white" />}
        $marginLeft={1}
      >
        Pay
      </Button>

      <Dialog
        title={`Pay Order #${order.orderNumber}`}
        open={Boolean(clientSecret)}
        onClose={handleClose}
      >
        {clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
              },
            }}
          >
            <PayOrderForm onSuccess={handlePaymentSuccess} />
          </Elements>
        )}

        <HoneyBox $display="flex" $gap={2} $justifyContent="flex-end" $paddingTop={2}>
          <Button
            onClick={handleClose}
            variant="secondary"
            size="full"
            icon={<CloseIcon color="neutral.white" />}
          >
            Close
          </Button>
        </HoneyBox>
      </Dialog>
    </>
  );
};
