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

type AccountRole = 'customer' | 'admin';

export interface User {
  role: AccountRole;
  email: string;
  isEmailVerified: boolean;
  firstName: Nullable<string>;
  lastName: Nullable<string>;
  phone: Nullable<string>;
}

export const signInRequest = async (payload: SignInRequestPayload) =>
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

interface QuoteRequestPayload {
  fileName: string;
  contentType: string;
  firstName: string;
  lastName: string;
  email: Nullable<string>;
  phone: Nullable<string>;
  password: Nullable<string>;
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
