import type { HTTPRequestMethod, Nullable } from '~/types';

export type NetlifyFunction =
  | 'sign-up'
  | 'sign-in'
  | 'verify-id-token'
  | 'quote-request'
  | 'upload-quote-request-model';

export interface NetlifyRequestResponse<Response = unknown> {
  status: string;
  data: Response;
}

export interface NetlifyRequestError<Name extends string = string, Code extends string = string> {
  status: 'error';
  data: {
    error: {
      name?: Name;
      code?: Code;
      message?: string;
    };
  };
}

interface NetlifyRequestOptions<Payload> {
  payload?: Payload;
  method?: HTTPRequestMethod;
  params?: Record<string, string | number>;
  request?: RequestInit;
}

export const netlifyRequest = async <Response, Payload = unknown>(
  funcName: NetlifyFunction,
  { payload, method = 'GET', params = {}, request }: NetlifyRequestOptions<Payload> = {},
): Promise<NetlifyRequestResponse<Response>> => {
  let body: Nullable<BodyInit> = null;

  const isFormData = payload instanceof FormData;

  if (isFormData) {
    body = payload;
    //
  } else if (payload) {
    body = JSON.stringify(payload);
  }

  const queryParams = new URLSearchParams(
    Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
      acc[key] = String(value);

      return acc;
    }, {}),
  ).toString();

  const response = await fetch(
    `${process.env.NETLIFY_SERVER || ''}/.netlify/functions/${funcName}?${queryParams}`,
    {
      method,
      body,
      credentials: 'include',
      headers: isFormData
        ? {}
        : {
            'Content-Type': 'application/json',
          },
      ...request,
    },
  );

  if (!response.ok) {
    return Promise.reject((await response.json()) as NetlifyRequestError);
  }

  return (await response.json()) as NetlifyRequestResponse<Response>;
};
