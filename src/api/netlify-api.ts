import type { Nullable } from '~/types';
import { FIREBASE_AUTH_ERRORS } from '~/configs';
import type { NetlifyRequestError } from './netlify-request';
import { netlifyRequest } from './netlify-request';

interface SignUpRequestPayload {
  email: string;
  password: string;
}

export type SignUpRequestError = NetlifyRequestError<
  'FirebaseError',
  keyof typeof FIREBASE_AUTH_ERRORS
>;

export const signUpRequest = (payload: SignUpRequestPayload) =>
  netlifyRequest('sign-up', {
    method: 'POST',
    payload,
  });

interface SignInRequestPayload {
  idToken: string;
}

export interface User {
  id: string;
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

interface QuoteRequestPayload {
  fileName: string;
  contentType: string;
  firstName: string;
  lastName: string;
  email: Nullable<string>;
  description: string;
  quantity: number;
  pricing: {
    estimated: number;
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
