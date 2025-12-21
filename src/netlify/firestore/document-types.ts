import { Timestamp } from 'firebase-admin/firestore';

import type { Nullable } from '~/types';
import type {
  ActorRole,
  AccountRole,
  UserId,
  QuoteStatus,
  QuoteJobTechnology,
  QuoteId,
  OrderId,
  OrderStatus,
  StripeCustomerId,
  Currency,
  StripePaymentIntentId,
} from '../types';

export type QuoteHistoryChangeId = string;

export type QuoteChangeRequestId = string;

type QuoteRequesterType = 'registered' | 'guest';

type QuotePricingStage = 'estimated' | 'final';

type QuoteChangeRequestStatus = 'new' | 'accepted' | 'rejected';

export interface SequenceDocument {
  value: number;
}

interface Document<Id extends string> {
  id: Id;
  createdAt: Timestamp;
}

export interface Actor {
  id: Nullable<UserId>;
  role: ActorRole;
}

export interface UserDocument extends Document<UserId> {
  stripeCustomerId: Nullable<StripeCustomerId>;
  role: AccountRole;
  email: string;
  firstName: Nullable<string>;
  lastName: Nullable<string>;
  phone: Nullable<string>;
  updatedAt: Nullable<Timestamp>;
}

export interface QuoteJob {
  technology: QuoteJobTechnology;
  material: Nullable<string>;
  color: Nullable<string>;
  quantity: number;
  notes: Nullable<string>;
}

interface QuoteGuest {
  firstName: string;
  lastName: string;
  email: string;
  phone: Nullable<string>;
}

export interface QuoteRequester {
  type: QuoteRequesterType;
  userId: Nullable<UserId>;
  guest: Nullable<QuoteGuest>;
}

export interface QuoteModel {
  fileName: string;
  fileUrl: string;
  solidVolumeMm3: number;
}

interface QuotePricingBreakdown {
  material: Nullable<number>;
  machineTime: Nullable<number>;
  labor: Nullable<number>;
}

export interface QuotePricing {
  type: QuotePricingStage;
  currency: Currency;
  amount: number;
  discountPct: number;
  discountAmount: number;
  vatPct: number;
  vatAmount: number;
  total: Nullable<number>;
  breakdown: Nullable<QuotePricingBreakdown>;
}

export interface QuoteDocument extends Document<QuoteId> {
  quoteNumber: string;
  requester: QuoteRequester;
  status: QuoteStatus;
  job: QuoteJob;
  model: QuoteModel;
  pricing: QuotePricing;
  pricedAt: Nullable<Timestamp>;
  acceptedAt: Nullable<Timestamp>;
  inProductionAt: Nullable<Timestamp>;
  rejectedAt: Nullable<Timestamp>;
  expiredAt: Nullable<Timestamp>;
  completedAt: Nullable<Timestamp>;
  updatedAt: Nullable<Timestamp>;
}

interface QuoteHistoryChangeDocument<Type extends string> extends Document<QuoteHistoryChangeId> {
  type: Type;
}

export interface QuoteHistoryStatusChangeDocument extends QuoteHistoryChangeDocument<'statusChange'> {
  by: Actor;
  from: QuoteStatus;
  to: QuoteStatus;
  reason: Nullable<string>;
}

export interface QuoteChangeRequestDocument extends Document<QuoteChangeRequestId> {
  userId: UserId;
  status: QuoteChangeRequestStatus;
  fields: Nullable<{
    quantity: Nullable<number>;
    material: Nullable<string>;
    notes: Nullable<string>;
  }>;
  message: Nullable<string>;
  acceptedAt: Nullable<Timestamp>;
  rejectedAt: Nullable<Timestamp>;
}

interface OrderCustomer {
  userId: Nullable<UserId>;
  stripeCustomerId: StripeCustomerId;
  email: string;
  firstName: string;
  lastName: string;
  phone: Nullable<string>;
}

export interface OrderJob {
  technology: QuoteJobTechnology;
  material: Nullable<string>;
  color: Nullable<string>;
  quantity: number;
  notes: Nullable<string>;
}

interface OrderPricing {
  currency: Currency;
  amount: number;
  discount: Nullable<number>;
  vat: Nullable<number>;
  total: Nullable<number>;
}

interface OrderPayment {
  paymentIntentId: StripePaymentIntentId;
  paidAt: Nullable<Timestamp>;
  refundedAt: Nullable<Timestamp>;
}

interface OrderShippingAddress {
  country: string;
  city: string;
  postalCode: string;
  line1: string;
  line2: Nullable<string>;
}

interface OrderShipping {
  carrier: 'RoyalMail' | 'DHL';
  trackingNumber: Nullable<string>;
  dispatchedAt: Nullable<Timestamp>;
  deliveredAt: Nullable<Timestamp>;
  address: Nullable<OrderShippingAddress>;
}

export interface OrderDocument extends Document<OrderId> {
  quoteId: QuoteId;
  orderNumber: string;
  status: OrderStatus;
  customer: OrderCustomer;
  job: OrderJob;
  pricing: OrderPricing;
  payment: Nullable<OrderPayment>;
  shipping: Nullable<OrderShipping>;
  updatedAt: Nullable<Timestamp>;
}
