import { assert, isFiniteNumber } from '@react-hive/honey-utils';

import type { Nullable } from '~/types';

interface CalculatePricingValuesOptions {
  amount: number;
  discountPct: Nullable<number>;
  vatPct: Nullable<number>;
}

export const buildQuotePricingValues = ({
  amount,
  discountPct: _discountPct,
  vatPct: _vatPct,
}: CalculatePricingValuesOptions) => {
  const discountPct = _discountPct ?? 0;
  const vatPct = _vatPct ?? 0;

  assert(isFiniteNumber(amount) && amount > 0 && amount <= 9999, 'Invalid amount');
  assert(
    isFiniteNumber(discountPct) && discountPct >= 0 && discountPct <= 100,
    'Invalid discount percent',
  );
  assert(isFiniteNumber(vatPct) && vatPct >= 0 && vatPct <= 30, 'Invalid VAT percent');

  const discountAmount = amount * (discountPct / 100);
  const subtotal = Math.max(0, amount - discountAmount);
  const vatAmount = subtotal * (vatPct / 100);

  const total = +(subtotal + vatAmount).toFixed(2);

  return {
    amount,
    discountPct,
    discountAmount,
    vatPct,
    vatAmount,
    total,
  };
};
