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
  email: string;
  password: string;
}

export type SignInRequestErrorCode = 'auth/invalid-credential';

export type SignInRequestError = NetlifyRequestError<'FirebaseError', SignInRequestErrorCode>;

export const signInRequest = (payload: SignInRequestPayload) =>
  netlifyRequest('sign-in', {
    method: 'POST',
    payload,
  });

export type VerifySessionRequestErrorCode = 'auth/argument-error' | 'auth/user-disabled';

export type VerifySessionRequestError = NetlifyRequestError<'Error', VerifySessionRequestErrorCode>;

export const verifySessionRequest = () => netlifyRequest('verify-session');
