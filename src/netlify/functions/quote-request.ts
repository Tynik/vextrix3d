import { assert, parseFileName } from '@react-hive/honey-utils';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';
import { v4 as uuidv4 } from 'uuid';

import type { Nullable } from '~/types';
import {
  COMPANY_EMAIL,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_QUOTE_REQUEST_MODELS_DIRECTORY,
  ONE_MINUTE_MS,
  ONE_WEEK_MS,
} from '../constants';
import { createHandler, sendEmail } from '../utils';
import { initFirebaseAdminApp } from '../firebase';
import type { Actor, QuoteRequester, UserDocument } from '../firestore';
import {
  createUser,
  buildQuoteHistoryActor,
  getExistingUserDocument,
  createQuote,
} from '../firestore';

export interface QuoteRequestPayload {
  fileName: string;
  contentType: string;
  firstName: Nullable<string>;
  lastName: Nullable<string>;
  email: Nullable<string>;
  phone: Nullable<string>;
  password: Nullable<string>;
  description: string;
  quantity: number;
  model: {
    solidVolumeMm3: number;
  };
  pricing: {
    estimated: number;
  };
  hasAcceptedLegalDocuments: Nullable<boolean>;
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
          error: {
            message: 'Payload is empty',
          },
        },
      };
    }

    assert(payload.quantity, 'Quantity is missing');
    assert(payload.description, 'Description is missing');
    assert(payload.fileName, 'Filename is missing');
    assert(payload.model, 'Model is missing');
    assert(payload.pricing, 'Pricing is missing');

    try {
      await initFirebaseAdminApp();

      let quoteRequester: QuoteRequester;
      let quoteHistoryActor: Actor;
      let user: Nullable<UserDocument> = null;

      if (cookies.session) {
        const decodedIdToken = await getAuth().verifySessionCookie(cookies.session, true);

        quoteRequester = {
          type: 'registered',
          userId: decodedIdToken.uid,
          guest: null,
        };

        user = await getExistingUserDocument(decodedIdToken.uid);
        quoteHistoryActor = buildQuoteHistoryActor(user);
      } else {
        assert(payload.firstName, 'The first name must be set');
        assert(payload.lastName, 'The last name must be set');
        assert(payload.email, 'The email must be set');
        assert(payload.phone, 'The phone must be set');
        assert(payload.hasAcceptedLegalDocuments, 'The legal documents must be accepted');

        if (payload.password) {
          const userRecord = await createUser({
            email: payload.email,
            password: payload.password,
            firstName: payload.firstName,
            lastName: payload.lastName,
            phone: payload.phone,
          });

          quoteRequester = {
            type: 'registered',
            userId: userRecord.uid,
            guest: null,
          };

          user = await getExistingUserDocument(userRecord.uid);
          quoteHistoryActor = buildQuoteHistoryActor(user);
        } else {
          quoteRequester = {
            type: 'guest',
            userId: null,
            guest: {
              firstName: payload.firstName,
              lastName: payload.lastName,
              email: payload.email,
              phone: payload.phone,
            },
          };

          quoteHistoryActor = buildQuoteHistoryActor(null);
        }
      }

      const email = user?.email ?? payload.email;
      assert(email, 'The email must be set');

      const firstName = user?.firstName ?? payload.firstName;
      assert(firstName, 'The first name must be set');

      const lastName = user?.lastName ?? payload.lastName;
      assert(lastName, 'The last name must be set');

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

      await createQuote({
        requester: quoteRequester,
        by: quoteHistoryActor,
        job: {
          technology: 'FDM',
          material: null,
          color: null,
          quantity: payload.quantity,
          description: payload.description,
        },
        model: {
          fileName: payload.fileName,
          fileUrl: downloadModelUrl,
          solidVolumeMm3: payload.model.solidVolumeMm3,
        },
        pricing: {
          type: 'estimated',
          currency: 'gbp',
          amount: payload.pricing.estimated,
          discountPct: 0,
          discountAmount: 0,
          vatPct: 0,
          vatAmount: 0,
          total: null,
          breakdown: {
            material: 0,
            machineTime: 0,
            labor: 0,
          },
        },
      });

      await sendEmail('quote-request', {
        to: COMPANY_EMAIL,
        subject: 'Quote Request',
        parameters: {
          firstName,
          lastName,
          email,
          downloadModelUrl,
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
            message: e.message,
          },
        },
      };
    }
  },
);
