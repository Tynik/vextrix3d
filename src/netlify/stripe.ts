import Stripe from 'stripe';
import { assert } from '@react-hive/honey-utils';

import { STRIPE_SECRET_KEY } from '~/netlify/constants';

export const initStripeClient = (): Stripe => {
  assert(STRIPE_SECRET_KEY, 'The `STRIPE_SECRET_KEY` must be set as environment variable');

  return new Stripe(STRIPE_SECRET_KEY, {
    apiVersion: '2025-12-15.clover',
  });
};
