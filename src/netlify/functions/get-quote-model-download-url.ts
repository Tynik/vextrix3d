import { getStorage } from 'firebase-admin/storage';
import { assert } from '@react-hive/honey-utils';

import {
  FIREBASE_QUOTE_REQUEST_MODELS_DIRECTORY,
  FIREBASE_STORAGE_BUCKET,
  ONE_MINUTE_MS,
} from '~/netlify/constants';
import type { QuoteId } from '~/netlify/types';
import { createHandler } from '../utils';
import { withSession } from '../auth';
import { getQuoteOrThrow } from '../firestore';

export type GetQuoteModelDownloadUrlPayload = {
  quoteId: QuoteId;
};

export const handler = createHandler(
  {
    allowedMethods: ['GET'],
  },
  withSession<GetQuoteModelDownloadUrlPayload>(async ({ decodedIdToken, isAdmin, event }) => {
    const quoteId = event.queryStringParameters?.quoteId;
    assert(quoteId, 'Quote ID is required');

    const { quote } = await getQuoteOrThrow(quoteId);

    const isQuoteOwner = quote.requester.userId === decodedIdToken.uid;
    assert(isAdmin || isQuoteOwner, 'Forbidden');

    const bucket = getStorage().bucket(FIREBASE_STORAGE_BUCKET);

    const modelPath = `${FIREBASE_QUOTE_REQUEST_MODELS_DIRECTORY}/${quote.model.systemFileName}`;
    const modelFile = bucket.file(modelPath);

    const expiresAt = Date.now() + 5 * ONE_MINUTE_MS;

    const [signedUrl] = await modelFile.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: expiresAt,
      responseDisposition: `attachment; filename="${quote.model.originalFileName}"`,
    });

    return {
      status: 'ok',
      data: {
        url: signedUrl,
        expiresAt,
      },
    };
  }),
);
