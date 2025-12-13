import type { Nullable } from '~/types';
import type { NetlifyRequestError } from './netlify-request';
import { netlifyRequest } from './netlify-request';

interface QuoteRequestPayload {
  fileName: string;
  contentType: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
  copies: number;
  estimatedQuote: {
    total: number;
  };
}

export const quoteRequest = async (payload: QuoteRequestPayload) => {
  const { uploadModelUrl } = (
    await netlifyRequest<{ uploadModelUrl: string }>('quote-request', {
      method: 'POST',
      payload,
    })
  ).data;

  return uploadModelUrl;
};

interface SignUpRequestPayload {
  email: string;
  password: string;
}

export type SignUpRequestErrorCode =
  | 'auth/email-already-in-use'
  | 'auth/invalid-email'
  | 'auth/weak-password';

export type SignUpRequestError = NetlifyRequestError<'FirebaseError', SignUpRequestErrorCode>;

export const signUpRequest = (payload: SignUpRequestPayload) =>
  netlifyRequest('sign-up', {
    method: 'POST',
    payload,
  });

interface SignInRequestPayload {
  idToken: string;
}

export interface User {
  email: string;
  displayName: Nullable<string>;
  phoneNumber: Nullable<string>;
  isEmailVerified: boolean;
}

export const signInRequest = async (payload: SignInRequestPayload) =>
  (
    await netlifyRequest<User>('sign-in', {
      method: 'POST',
      payload,
    })
  ).data;

export const signOutRequest = async () =>
  (
    await netlifyRequest<User>('sign-out', {
      method: 'POST',
    })
  ).data;
