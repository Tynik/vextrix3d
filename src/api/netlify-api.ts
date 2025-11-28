import { netlifyRequest } from '~/api/netlify-request';

interface UploadedModel {
  url: string;
}

export const uploadQuoteRequestModel = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  return (
    await netlifyRequest<UploadedModel>('upload-quote-request-model', {
      payload: formData,
      method: 'POST',
    })
  ).data;
};
