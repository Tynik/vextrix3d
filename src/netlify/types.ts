import Stripe from 'stripe';

import type { Nullable } from '~/types';

export type UserId = string;

export type QuoteId = string;

export type OrderId = string;

export type StripeCustomerId = Stripe.Customer['id'];

export type StripePaymentIntentId = Stripe.PaymentIntent['id'];

export type Email = `${string}@${string}.${string}`;

export type EmailTemplateName = 'quote-request' | 'send-quote';

export type AccountRole = 'customer' | 'admin';

export type ActorRole = AccountRole | 'system';

export type QuoteJobTechnology = 'FDM' | 'SLA';

export type QuoteRequesterType = 'registered' | 'guest';

// https://www.iso.org/iso-4217-currency-codes.html
export type Currency = 'gbp' | 'eur' | 'usd';

export type QuoteStatus =
  /**
   * Newly submitted quote request.
   * Created by the customer and not yet reviewed.
   * The customer may still edit allowed non-critical fields.
   */
  | 'new'
  /**
   * Quote has been reviewed and priced.
   * Price, scope, and conditions are visible to the customer.
   * The quote is locked; the customer may only request changes or accept it.
   */
  | 'priced'
  /**
   * The customer has requested changes to a priced or accepted quote.
   * No direct edits are allowed.
   * Awaiting review and action by admin.
   */
  | 'changeRequested'
  /**
   * The customer has agreed to the price and terms.
   * This status indicates intent only and does NOT imply payment by itself.
   * Typically followed by payment confirmation and transition to production.
   */
  | 'accepted'
  /**
   * Quote was explicitly rejected by the customer or declined by admin.
   * The quote is closed and no further actions are permitted.
   */
  | 'rejected'
  /**
   * Quote has expired due to inactivity or passing its validity period.
   * The customer must submit a new quote request to proceed.
   */
  | 'expired'
  /**
   * Manufacturing is currently in progress.
   * Printing and post-processing are underway.
   * No changes or cancellations are permitted.
   */
  | 'inProduction'
  /**
   * Quote has been fully fulfilled.
   * The quote is permanently locked and read-only.
   */
  | 'completed';

export type OrderStatus =
  | 'new'
  | 'paid'
  | 'inProduction'
  | 'shipped'
  | 'completed'
  | 'cancelled'
  | 'refunded'
  | 'expired';

export interface PaginatedResponse<T> {
  data: T[];
  limit: number;
  hasNextPage: boolean;
  nextCursor: Nullable<number>;
}

export interface User {
  role: AccountRole;
  email: string;
  isEmailVerified: boolean;
  firstName: string;
  lastName: string;
  phone: Nullable<string>;
}

interface OrderJob {
  technology: QuoteJobTechnology;
  material: Nullable<string>;
  color: Nullable<string>;
  quantity: number;
  notes: Nullable<string>;
}

interface OrderPricing {
  amount: number;
  discountPct: number;
  discountAmount: number;
  vatPct: number;
  vatAmount: number;
  total: number;
}

export interface OrderPayment {
  paymentIntentId: StripePaymentIntentId;
  paidAt: Nullable<number>;
  refundedAt: Nullable<number>;
}

export interface Order {
  id: OrderId;
  quoteId: QuoteId;
  orderNumber: string;
  status: OrderStatus;
  job: OrderJob;
  pricing: OrderPricing;
  payment: Nullable<OrderPayment>;
  createdAt: number;
}

interface QuoteRequester {
  type: QuoteRequesterType;
  userId: Nullable<UserId>;
  guest: Nullable<{
    firstName: string;
    lastName: string;
    email: string;
    phone: Nullable<string>;
  }>;
}

interface QuoteJob {
  technology: QuoteJobTechnology;
  material: Nullable<string>;
  color: Nullable<string>;
  quantity: number;
  notes: Nullable<string>;
}

interface QuoteModel {
  fileName: string;
  fileUrl: string;
}

interface QuotePricing {
  amount: number;
  discountPct: number;
  discountAmount: number;
  vatPct: number;
  vatAmount: number;
  total: Nullable<number>;
}

export interface Quote {
  id: QuoteId;
  quoteNumber: string;
  status: QuoteStatus;
  requester: Nullable<QuoteRequester>;
  job: QuoteJob;
  model: QuoteModel;
  pricing: Nullable<QuotePricing>;
  pricedAt: Nullable<number>;
  acceptedAt: Nullable<number>;
  inProductionAt: Nullable<number>;
  rejectedAt: Nullable<number>;
  expiredAt: Nullable<number>;
  completedAt: Nullable<number>;
  updatedAt: Nullable<number>;
  createdAt: number;
}
