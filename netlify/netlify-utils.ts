import type { Handler, HandlerResponse, HandlerEvent, HandlerContext } from '@netlify/functions';

import type { Nullable } from './netlify-types';
import { NETLIFY_EMAILS_SECRET, URL, SITE_DOMAIN } from './netlify-constants';

type HTTPMethod = 'POST' | 'GET' | 'OPTIONS' | 'PUT' | 'PATCH' | 'DELETE';

export function assert(condition: any, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

interface CreateResponseOptions {
  statusCode?: number;
  allowMethods?: HTTPMethod[] | null;
  headers?: Record<string, string>;
}

const createResponse = <Data>(
  data: Data,
  { statusCode = 200, allowMethods = null, headers = {} }: CreateResponseOptions = {},
): HandlerResponse => ({
  statusCode,
  body: JSON.stringify(data),
  headers: {
    'Access-Control-Allow-Origin': SITE_DOMAIN ?? '',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': allowMethods?.join(', ') ?? '*',
    'Content-Type': 'application/json',
    ...headers,
  },
});

export interface CreateHandlerFunctionOptions<Payload = unknown> {
  event: HandlerEvent;
  context: HandlerContext;
  cookies: Record<string, string>;
  payload: Payload | null;
}

type CreateHandlerOptions = {
  allowMethods?: HTTPMethod[];
} | null;

export type CreateHandlerFunction<Payload, Response = unknown> = (
  options: CreateHandlerFunctionOptions<Payload>,
) => Promise<
  Nullable<{
    data?: Response;
    status: 'ok' | 'error';
    statusCode?: number;
    headers?: Record<string, string>;
  }>
>;

export const createHandler = <Payload = unknown>(
  options: CreateHandlerOptions,
  fn: CreateHandlerFunction<Payload>,
): Handler => {
  return async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(
        { message: 'Successful preflight call.' },
        { allowMethods: options?.allowMethods },
      );
    }

    if (options?.allowMethods && !options.allowMethods.includes(event.httpMethod as HTTPMethod)) {
      return createResponse(`You cannot use HTTP method "${event.httpMethod}" for this endpoint`, {
        statusCode: 400,
        allowMethods: options.allowMethods,
      });
    }

    try {
      const cookieHeader = event.headers.cookie || event.headers.Cookie;

      const cookies: Record<string, string> = {};
      if (cookieHeader) {
        cookieHeader.split('; ').forEach(cookie => {
          const [name, value] = cookie.split('=');

          cookies[decodeURIComponent(name.trim())] = decodeURIComponent(value.trim());
        });
      }

      const payload =
        event.body && !event.isBase64Encoded ? (JSON.parse(event.body) as Payload) : null;

      const { statusCode, headers, ...result } =
        (await fn({ event, context, cookies, payload })) || {};

      return createResponse(result, {
        statusCode,
        headers,
        allowMethods: options?.allowMethods,
      });
    } catch (e) {
      console.error(e);

      return createResponse(
        { status: 'error' },
        {
          statusCode: 500,
          allowMethods: options?.allowMethods,
        },
      );
    }
  };
};

interface SendEmailOptions {
  from: string;
  to: string;
  subject: string;
  parameters: Record<string, string | undefined>;
}

export const sendEmail = (
  emailTemplate: 'calculate-quote',
  { from, to, subject, parameters }: SendEmailOptions,
) => {
  assert(NETLIFY_EMAILS_SECRET, 'The `NETLIFY_EMAILS_SECRET` must be set as environment variable');

  return fetch(`${URL}/.netlify/functions/emails/${emailTemplate}`, {
    method: 'POST',
    headers: {
      'netlify-emails-secret': NETLIFY_EMAILS_SECRET,
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      parameters,
    }),
  });
};
