import { toast } from 'react-toastify';

import { NetlifyRequestError } from './netlify-request';

export const handleApiError = (e: any) => {
  if ('data' in e) {
    const error = e as NetlifyRequestError;
    const message = error.data.error.message;

    if (message) {
      return toast(error.data.error.message, {
        type: 'error',
      });
    }
  }

  console.error(e);

  return toast('Something went wrong', {
    type: 'error',
  });
};
