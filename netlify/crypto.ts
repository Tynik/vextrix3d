import type { BinaryLike } from 'crypto';
import crypto from 'crypto';

export const createHexHash = (data: BinaryLike): string =>
  crypto.createHash('sha256').update(data).digest('hex');
