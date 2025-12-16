import { assert, parseFileName } from '@react-hive/honey-utils';
import { getAuth } from 'firebase-admin/auth';
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
import type { Nullable } from '../types';
import type { QuoteHistoryActor, QuoteRequester, UserDocument } from '../firestore';
import { buildQuoteHistoryActor, getExistingUserDocument, createQuote } from '../firestore';

interface QuoteRequestPayload {
  fileName: string;
  contentType: string;
  firstName: string;
  lastName: string;
  email: Nullable<string>;
  description: string;
  quantity: number;
  pricing: {
    estimated: number;
  };
}

export const handler = createHandler<QuoteRequestPayload>(
  {
    allowedMethods: ['POST'],
  },
  async ({ payload, cookies }) => {
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

    try {
      await initFirebaseAdminApp();

      const bucket = getStorage().bucket(FIREBASE_STORAGE_BUCKET);
      //
      const fileId = uuidv4();
      const [, fileExt] = parseFileName(payload.fileName);

      const modelPath = `${FIREBASE_QUOTE_REQUEST_MODELS_DIRECTORY}/${fileId}.${fileExt}`;
      const bucketFile = bucket.file(modelPath);

      const timestamp = Date.now();

      const [downloadModelUrl] = await bucketFile.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: timestamp + ONE_WEEK_MS,
      });

      const [uploadModelUrl] = await bucketFile.getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: timestamp + 5 * ONE_MINUTE_MS, // 5 mins
        contentType: payload.contentType,
      });

      let requester: QuoteRequester;
      let historyActor: QuoteHistoryActor;
      let userDocument: Nullable<UserDocument> = null;

      if (cookies.session) {
        const decodedIdToken = await getAuth().verifySessionCookie(cookies.session, true);

        requester = {
          type: 'registered',
          userId: decodedIdToken.uid,
          guest: null,
        };

        userDocument = await getExistingUserDocument(decodedIdToken.uid);

        historyActor = buildQuoteHistoryActor(userDocument);
      } else {
        assert(payload.email, 'The email must be set');

        requester = {
          type: 'guest',
          userId: null,
          guest: {
            name: `${payload.firstName} ${payload.lastName}`,
            email: payload.email,
            phone: null,
          },
        };

        historyActor = buildQuoteHistoryActor(null);
      }

      const email = userDocument?.email ?? payload.email;
      assert(email, 'The email must be set');

      await createQuote({
        requester,
        by: historyActor,
        job: {
          technology: 'FDM',
          material: 'PLA',
          color: 'black',
          quantity: payload.quantity,
          notes: payload.description,
        },
        model: {
          fileName: payload.fileName,
          fileUrl: downloadModelUrl,
          volumeCm3: 0,
        },
        pricing: {
          type: 'estimated',
          currency: 'GBP',
          amount: payload.pricing.estimated,
          breakdown: {
            material: 0,
            machineTime: 0,
            labor: 0,
          },
        },
      });

      await sendEmail('quote-request', {
        from: 'Vextrix3D <no-reply@vextrix3d.co.uk>',
        to: COMPANY_EMAIL,
        subject: 'Quote Request',
        parameters: {
          downloadModelUrl,
          firstName: payload.firstName,
          lastName: payload.lastName,
          email,
          description: payload.description,
          quantity: payload.quantity.toString(),
          estimated: payload.pricing.estimated.toString(),
        },
      });

      return {
        status: 'ok',
        data: {
          uploadModelUrl,
        },
      };
    } catch (e: any) {
      console.error(e);

      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: {
            name: 'Error',
            code: e.code,
          },
        },
      };
    }
  },
);
