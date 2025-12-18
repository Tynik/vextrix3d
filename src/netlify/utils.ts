import type { Handler, HandlerResponse, HandlerEvent, HandlerContext } from '@netlify/functions';
import { assert } from '@react-hive/honey-utils';

import type { Nullable } from '~/types';
import type { Email, EmailTemplateName } from './types';
import { NETLIFY_EMAILS_SECRET, URL, SITE_DOMAIN } from './constants';

type HttpRequestMethod = 'POST' | 'GET' | 'OPTIONS' | 'PUT' | 'PATCH' | 'DELETE';

interface CookieOptions {
  name: string;
  value: string;
  domain?: string;
  path?: string;
  expires?: Date;
  maxAge?: number;
  secure?: boolean;
  partitioned?: boolean;
  httpOnly?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

const formatCookie = ({
  name,
  domain,
  value,
  path = '/',
  expires,
  maxAge,
  secure,
  partitioned,
  httpOnly = false,
  sameSite,
}: CookieOptions) => {
  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (path) {
    cookie += `; Path=${path}`;
  }

  if (domain) {
    cookie += `; Domain=${domain}`;
  }

  if (expires) {
    cookie += `; Expires=${expires.toUTCString()}`;
  }

  if (maxAge !== undefined) {
    cookie += `; Max-Age=${maxAge}`;
  }

  if (partitioned) {
    cookie += '; Partitioned';
  }

  if (httpOnly) {
    cookie += '; HttpOnly';
  }

  if (sameSite) {
    cookie += `; SameSite=${sameSite}`;
  }

  if (secure || sameSite === 'None') {
    cookie += '; Secure';
  }

  return cookie;
};

interface CreateResponseOptions {
  statusCode?: number;
  allowedMethods?: HttpRequestMethod[] | null;
  headers?: Record<string, string>;
  cookie?: CookieOptions;
}

const createResponse = <Data>(
  data: Data,
  { statusCode = 200, allowedMethods = null, headers = {}, cookie }: CreateResponseOptions = {},
): HandlerResponse => ({
  statusCode,
  body: JSON.stringify(data),
  headers: {
    'Access-Control-Allow-Origin': SITE_DOMAIN ?? '',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': allowedMethods?.join(', ') ?? '*',
    'Content-Type': 'application/json',
    ...headers,
    ...(cookie && {
      'Set-Cookie': formatCookie(cookie),
    }),
  },
});

export interface CreateHandlerFunctionOptions<Payload = unknown> {
  event: HandlerEvent;
  context: HandlerContext;
  headers: Record<string, string | undefined>;
  cookies: Record<string, string>;
  payload: Payload | null;
}

interface CreateHandlerOptions {
  allowedMethods?: HttpRequestMethod[];
}

export type CreateHandlerFunction<Payload, Response = unknown> = (
  options: CreateHandlerFunctionOptions<Payload>,
) => Promise<
  Nullable<{
    data?: Response;
    status: 'ok' | 'error';
    statusCode?: number;
    headers?: Record<string, string>;
    cookie?: CookieOptions;
  }>
>;

export const createHandler = <Payload = unknown>(
  { allowedMethods }: CreateHandlerOptions,
  fn: CreateHandlerFunction<Payload>,
): Handler => {
  return async (event, context) => {
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(
        {
          message: 'Successful preflight call.',
        },
        {
          allowedMethods,
        },
      );
    }

    if (allowedMethods && !allowedMethods.includes(event.httpMethod as HttpRequestMethod)) {
      return createResponse(`You cannot use HTTP method "${event.httpMethod}" for this endpoint`, {
        statusCode: 400,
        allowedMethods,
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

      const { statusCode, headers, cookie, ...result } =
        (await fn({
          event,
          context,
          headers: event.headers,
          cookies,
          payload,
        })) || {};

      return createResponse(result, {
        statusCode,
        headers,
        cookie,
        allowedMethods,
      });
    } catch (e) {
      console.error(e);

      return createResponse(
        {
          status: 'error',
        },
        {
          statusCode: 500,
          allowedMethods,
        },
      );
    }
  };
};

interface SendEmailAttachment {
  // Base64 encoded string
  content: string;
  filename: string;
  type: string;
}

interface SendEmailOptions {
  from: string | `${string} <${Email}>`;
  to: string;
  cc?: string;
  subject: string;
  parameters: Record<string, string | undefined>;
  attachments?: SendEmailAttachment[];
}

export const sendEmail = (
  emailTemplate: EmailTemplateName,
  { from, to, subject, parameters, attachments }: SendEmailOptions,
) => {
  assert(URL, 'The `URL` must be set as environment variable');
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
      attachments,
    }),
  });
};
