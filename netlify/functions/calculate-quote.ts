import { createHandler, sendEmail } from '../netlify-utils';

interface CalculateQuotePayload {
  fullName: string;
  description: string;
  email: string;
}

export const handler = createHandler<CalculateQuotePayload>(
  { allowMethods: ['POST'] },
  async ({ payload }) => {
    if (!payload) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'Payload is empty',
        },
      };
    }

    if (!payload.description) {
      return {
        status: 'error',
        statusCode: 400,
        data: {
          error: 'Invalid data',
        },
      };
    }

    const response = await sendEmail('calculate-quote', {
      from: payload.email,
      to: 'vextrix3d@gmail.com',
      subject: 'Quote',
      parameters: {
        name: payload.fullName,
        description: payload.description,
      },
    });

    console.log(response);

    return {
      status: 'ok',
      data: {},
    };
  },
);
