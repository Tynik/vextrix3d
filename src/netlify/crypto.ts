import type { BinaryLike } from 'crypto';
import type { JwtPayload, SignOptions } from 'jsonwebtoken';
import { assert } from '@react-hive/honey-utils';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { SECRET_KEY } from '~/netlify/constants';
import type { Nullable } from '~/types';

export type TokenPayload = Record<string, Nullable<string | number | undefined>>;

export const createToken = <Payload extends TokenPayload>(
  payload: Payload,
  options: SignOptions = {},
): string => {
  assert(SECRET_KEY, 'The `SECRET_KEY` must be set as environment variable');

  return jwt.sign(payload, SECRET_KEY, options);
};

export const verifyToken = <Payload extends TokenPayload>(token: string): JwtPayload & Payload => {
  assert(SECRET_KEY, 'The `SECRET_KEY` must be set as environment variable');

  return jwt.verify(token, SECRET_KEY) as JwtPayload & Payload;
};

export const createHexHash = (data: BinaryLike): string =>
  crypto.createHash('sha256').update(data).digest('hex');
