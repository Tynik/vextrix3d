import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';

import { AttachMoneyIcon } from '~/icons';
import { Button } from '~/components';

interface PayOrderFormProps {
  onSuccess: () => void;
}

export const PayOrderForm = ({ onSuccess }: PayOrderFormProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (result.error) {
      toast(result.error.message ?? 'Payment failed', {
        type: 'error',
      });

      setLoading(false);
      return;
    }

    onSuccess();
  };

  return (
    <form onSubmit={handlePay}>
      <PaymentElement />

      <Button
        loading={loading}
        disabled={!stripe}
        type="submit"
        variant="primary"
        size="full"
        icon={<AttachMoneyIcon color="neutral.white" />}
        $marginTop={2}
      >
        Pay now
      </Button>
    </form>
  );
};
