import { loadStripe } from '@stripe/stripe-js';
import { assert } from '@react-hive/honey-utils';

const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;
assert(publishableKey, 'STRIPE_PUBLISHABLE_KEY must be set as environment variable');

export const stripePromise = loadStripe(publishableKey);
