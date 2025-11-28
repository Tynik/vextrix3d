import { parse } from 'parse-multipart-data';
import { assert } from '@react-hive/honey-utils';

import { COMPANY_EMAIL } from '../constants';
import { createHandler, sendEmail } from '../utils';
import { initFirebaseApp } from '../firebase';

initFirebaseApp();

interface DataPart {
  name: string;
  data: Buffer;
}

interface ModelPayload extends DataPart {
  filename: string;
  type: string;
}

type QuoteRequestPayload = {
  model: ModelPayload;
  firstName: DataPart;
  lastName: DataPart;
  email: DataPart;
  description: DataPart;
};

export const handler = createHandler({ allowMethods: ['POST'] }, async ({ event }) => {
  assert(COMPANY_EMAIL, 'The `COMPANY_EMAIL` must be set as environment variable');

  const contentType = event.headers['content-type'];
  if (!contentType) {
    return {
      status: 'error',
      statusCode: 400,
      data: {
        error: 'Content type is not present in headers',
      },
    };
  }

  const boundary = contentType.split('=').pop();
  if (!boundary) {
    return {
      status: 'error',
      statusCode: 400,
      data: {
        error: 'Boundary cannot be identified',
      },
    };
  }

  if (!event.body) {
    return {
      status: 'error',
      statusCode: 400,
      data: {
        error: 'Body is empty',
      },
    };
  }

  const bodyParts = parse(Buffer.from(event.body, 'base64'), boundary);

  const { model, email, firstName, lastName, description } = bodyParts.reduce<QuoteRequestPayload>(
    (result, part) => {
      if (part.name) {
        // @ts-expect-error
        result[part.name] = part;
      }

      return result;
    },
    {} as never,
  );

  // const bucket = getStorage().bucket(FIREBASE_STORAGE_BUCKET);
  //
  // const fileId = uuidv4();
  // const [, fileExt] = parseFileName(payload.model.filename);

  // const file = bucket.file(`quote-request-models/${fileId}.${fileExt}`);

  // await file.save(payload.model.data, {
  //   metadata: {
  //     contentType: payload.model.type,
  //   },
  // });

  // const modelUrl = await getDownloadURL(file);

  const response = await sendEmail('quote-request', {
    from: email.data.toString(),
    to: COMPANY_EMAIL,
    subject: 'Quote Request',
    parameters: {
      firstName: firstName.data.toString(),
      lastName: lastName.data.toString(),
      description: description.data.toString(),
    },
    attachments: [
      {
        content: model.data.toString('base64'),
        filename: model.filename,
        type: model.type,
      },
    ],
  });

  if (!response.ok) {
    console.error(await response.json());
  }

  return {
    status: response.ok ? 'ok' : 'error',
    statusCode: response.status,
    data: {},
  };
});
