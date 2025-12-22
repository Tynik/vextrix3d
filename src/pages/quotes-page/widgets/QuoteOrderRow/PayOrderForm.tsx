import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

import type { Nullable } from '~/types';
import { AttachMoneyIcon } from '~/icons';
import { Alert, Button } from '~/components';

interface PayOrderFormProps {
  onSuccess: () => void;
}

export const PayOrderForm = ({ onSuccess }: PayOrderFormProps) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Nullable<string>>(null);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (result.error) {
      setError(result.error.message ?? 'Payment failed');
      setLoading(false);
      return;
    }

    onSuccess();
  };

  return (
    <form onSubmit={handlePay}>
      <PaymentElement />

      {error && <Alert severity="error">{error}</Alert>}

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
