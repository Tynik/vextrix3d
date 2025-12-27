import { FIREBASE_AUTH_ERRORS } from '~/configs';
import type { Order, PaginatedResponse, Quote, User } from '~/netlify/types';
import type { SignupPayload } from '~/netlify/functions/sign-up';
import type { SignInPayload } from '~/netlify/functions/sign-in';
import type { QuoteRequestPayload } from '~/netlify/functions/quote-request';
import type { PriceQuotePayload } from '~/netlify/functions/price-quote';
import type { GetQuotesPayload } from '~/netlify/functions/get-quotes';
import type { GetQuoteOrdersPayload } from '~/netlify/functions/get-quote-orders';
import type { AcceptQuotePayload } from '~/netlify/functions/accept-quote';
import type { RejectQuotePayload } from '~/netlify/functions/reject-quote';
import type { PayOrderPayload } from '~/netlify/functions/pay-order';
import type { NetlifyRequestError } from './netlify-request';
import { netlifyRequest } from './netlify-request';

export type SignUpRequestError = NetlifyRequestError<
  'FirebaseError',
  keyof typeof FIREBASE_AUTH_ERRORS
>;

export const signUpRequest = (payload: SignupPayload) =>
  netlifyRequest('sign-up', {
    method: 'POST',
    payload,
  });

export const signInRequest = async (payload: SignInPayload) =>
  (
    await netlifyRequest('sign-in', {
      method: 'POST',
      payload,
    })
  ).data;

export const signOutRequest = async () =>
  (
    await netlifyRequest('sign-out', {
      method: 'POST',
    })
  ).data;

export const getUserProfileRequest = async (idToken: string) =>
  (
    await netlifyRequest<User>('get-user-profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    })
  ).data;

export const quoteRequest = async (payload: QuoteRequestPayload) => {
  const { uploadModelUrl } = (
    await netlifyRequest<{ uploadModelUrl: string }>('quote-request', {
      method: 'POST',
      payload,
    })
  ).data;

  return uploadModelUrl;
};

export const priceQuote = async (payload: PriceQuotePayload) =>
  (
    await netlifyRequest('price-quote', {
      method: 'POST',
      payload,
    })
  ).data;

export const getQuotes = async (params: GetQuotesPayload) =>
  (
    await netlifyRequest<PaginatedResponse<Quote>>('get-quotes', {
      method: 'GET',
      params,
    })
  ).data;

export const getQuoteOrders = async (params: GetQuoteOrdersPayload) =>
  (
    await netlifyRequest<PaginatedResponse<Order>>('get-quote-orders', {
      method: 'GET',
      params,
    })
  ).data;

export const acceptQuote = async (payload: AcceptQuotePayload) =>
  (
    await netlifyRequest('accept-quote', {
      method: 'POST',
      payload,
    })
  ).data;

export const rejectQuote = async (payload: RejectQuotePayload) =>
  (
    await netlifyRequest('reject-quote', {
      method: 'POST',
      payload,
    })
  ).data;

export const payOrder = async (payload: PayOrderPayload) =>
  (
    await netlifyRequest<{ clientSecret: string }>('pay-order', {
      method: 'POST',
      payload,
    })
  ).data;
