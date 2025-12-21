import React, { useCallback, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HoneyBox } from '@react-hive/honey-layout';
import { Elements } from '@stripe/react-stripe-js';

import type { Nullable } from '~/types';
import type { Order } from '~/netlify/types';
import { stripePromise } from '~/stripe';
import { handleApiError, payOrder } from '~/api';
import { AttachMoneyIcon, CheckIcon, CloseIcon } from '~/icons';
import { Button, CueShadows, Dialog } from '~/components';
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

      // await queryClient.invalidateQueries({
      //   queryKey: [QUOTE_ORDERS_QUERY_KEY, order.quoteId],
      // });
    } catch (e) {
      handleApiError(e);
    }
  };

  const handleClose = useCallback(() => {
    setClientSecret(null);
  }, []);

  return (
    <>
      <Button
        loading={payOrderMutation.isPending}
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
            <PayOrderForm />
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
