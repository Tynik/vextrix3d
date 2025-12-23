import { isFiniteNumber } from '@react-hive/honey-utils';

import type { Nullable } from '~/types';

/**
 * Formats a numeric value as GBP currency for UK users.
 *
 * Examples:
 * - formatCurrencyGBP(10)        → "£10.00"
 * - formatCurrencyGBP(1234.5)    → "£1,234.50"
 * - formatCurrencyGBP(0)         → "£0.00"
 * - formatCurrencyGBP(null)      → "£0.00"
 */
export const formatCurrency = (value: Nullable<number> | undefined): string => {
  const amount = isFiniteNumber(value) ? value : 0;

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
