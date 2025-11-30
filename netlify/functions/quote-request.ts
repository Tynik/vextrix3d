import { assert, parseFileName } from '@react-hive/honey-utils';
import { getStorage } from 'firebase-admin/storage';
import { v4 as uuidv4 } from 'uuid';

import { COMPANY_EMAIL, FIREBASE_STORAGE_BUCKET } from '../constants';
import { createHandler, sendEmail } from '../utils';
import { initFirebaseApp } from '../firebase';

initFirebaseApp();

interface QuoteRequestPayload {
  fileName: string;
  contentType: string;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
}

export const handler = createHandler<QuoteRequestPayload>(
  { allowMethods: ['POST'] },
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

    const bucket = getStorage().bucket(FIREBASE_STORAGE_BUCKET);
    //
    const fileId = uuidv4();
    const [, fileExt] = parseFileName(payload.fileName);

    const modelPath = `quote-request-models/${fileId}.${fileExt}`;

    const [downloadModelUrl] = await bucket.file(modelPath).getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const [uploadModelUrl] = await bucket.file(modelPath).getSignedUrl({
      version: 'v4',
      action: 'write',
      expires: Date.now() + 5 * 60 * 1000, // 5 mins
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
      },
    });

    if (!response.ok) {
      console.error(await response.json());
    }

    return {
      status: response.ok ? 'ok' : 'error',
      statusCode: response.status,
      data: {
        uploadModelUrl,
      },
    };
  },
);
