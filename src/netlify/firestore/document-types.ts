import { Timestamp } from 'firebase-admin/firestore';

import type { Nullable } from '~/types';
import type { StipeCustomerId } from './generic';
import type { ActorRole, AccountRole, UserId, QuoteStatus, QuoteJobTechnology } from '../types';

export type QuoteHistoryId = string;

type QuoteRequesterType = 'registered' | 'guest';

type QuotePricingStage = 'estimated' | 'final';

export interface UserDocument {
  id: UserId;
  stripeCustomerId: Nullable<StipeCustomerId>;
  role: AccountRole;
  email: string;
  firstName: Nullable<string>;
  lastName: Nullable<string>;
  phone: Nullable<string>;
  updatedAt: Timestamp;
  createdAt: Timestamp;
}

export interface QuoteJob {
  technology: QuoteJobTechnology;
  material: string;
  color: string;
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
  material: number;
  machineTime: number;
  labor: number;
}

export interface QuotePricing {
  type: QuotePricingStage;
  currency: 'GBP';
  amount: number;
  discount: Nullable<number>;
  vat: Nullable<number>;
  total: Nullable<number>;
  breakdown: QuotePricingBreakdown;
}

export interface QuoteDocument {
  id: string;
  requester: QuoteRequester;
  status: QuoteStatus;
  job: QuoteJob;
  model: QuoteModel;
  pricing: QuotePricing;
  pricedAt: Nullable<Timestamp>;
  sentAt: Nullable<Timestamp>;
  acceptedAt: Nullable<Timestamp>;
  rejectedAt: Nullable<Timestamp>;
  expiredAt: Nullable<Timestamp>;
  updatedAt: Timestamp;
  createdAt: Timestamp;
}

export interface QuoteHistoryActor {
  id: Nullable<UserId>;
  role: ActorRole;
}

export interface QuoteHistoryStatusChangeDocument {
  id: QuoteHistoryId;
  type: 'statusChange';
  at: Timestamp;
  by: QuoteHistoryActor;
  from: QuoteStatus;
  to: QuoteStatus;
  reason: Nullable<string>;
}
