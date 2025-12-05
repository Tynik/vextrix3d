import { netlifyRequest } from '~/api/netlify-request';

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
