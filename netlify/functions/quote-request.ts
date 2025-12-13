import { assert, parseFileName } from '@react-hive/honey-utils';
import { getStorage } from 'firebase-admin/storage';
import { v4 as uuidv4 } from 'uuid';

import {
  COMPANY_EMAIL,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_QUOTE_REQUEST_MODELS_DIRECTORY,
  ONE_MINUTE_MS,
  ONE_WEEK_MS,
} from '../constants';
import { createHandler, sendEmail } from '../utils';
import { initFirebaseAdminApp } from '../firebase';

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

export const handler = createHandler<QuoteRequestPayload>(
  {
    allowedMethods: ['POST'],
  },
  async ({ payload }) => {
    assert(COMPANY_EMAIL, 'The `COMPANY_EMAIL` must be set as environment variable');

    if (!payload) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'Payload is empty',
        },
      };
    }

    await initFirebaseAdminApp();

    const bucket = getStorage().bucket(FIREBASE_STORAGE_BUCKET);
    //
    const fileId = uuidv4();
    const [, fileExt] = parseFileName(payload.fileName);

    const modelPath = `${FIREBASE_QUOTE_REQUEST_MODELS_DIRECTORY}/${fileId}.${fileExt}`;

    const currentTimestamp = Date.now();

    const [downloadModelUrl] = await bucket.file(modelPath).getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: currentTimestamp + ONE_WEEK_MS,
    });

    const [uploadModelUrl] = await bucket.file(modelPath).getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: currentTimestamp + 5 * ONE_MINUTE_MS, // 5 mins
      contentType: payload.contentType,
    });

    const response = await sendEmail('quote-request', {
      from: 'Vextrix3D <no-reply@vextrix3d.co.uk>',
      to: COMPANY_EMAIL,
      subject: 'Quote Request',
      parameters: {
        downloadModelUrl,
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        description: payload.description,
        copies: payload.copies.toString(),
        estimatedQuoteTotal: payload.estimatedQuote.total.toString(),
      },
    });

    return {
      status: response.ok ? 'ok' : 'error',
      statusCode: response.status,
      data: {
        uploadModelUrl,
      },
    };
  },
);
