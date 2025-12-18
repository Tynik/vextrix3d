import type { Nullable } from '~/types';

export type UserId = string;

export type QuoteId = string;

export type Email = `${string}@${string}.${string}`;

export type EmailTemplateName = 'quote-request';

export type AccountRole = 'customer' | 'admin';

export type ActorRole = AccountRole | 'system';

export type QuoteJobTechnology = 'FDM' | 'SLA';

export type QuoteStatus = 'new' | 'priced' | 'sent' | 'accepted' | 'rejected' | 'expired';

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
  firstName: Nullable<string>;
  lastName: Nullable<string>;
  phone: Nullable<string>;
}

export interface Quote {
  id: QuoteId;
  status: QuoteStatus;
  job: {
    technology: QuoteJobTechnology;
    material: string;
    color: string;
    quantity: number;
    notes: Nullable<string>;
  };
  model: {
    fileName: string;
  };
  pricedAt: Nullable<number>;
  sentAt: Nullable<number>;
  acceptedAt: Nullable<number>;
  rejectedAt: Nullable<number>;
  expiredAt: Nullable<number>;
  updatedAt: number;
  createdAt: number;
}
