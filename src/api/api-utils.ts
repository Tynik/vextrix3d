import { toast } from 'react-toastify';

import { NetlifyRequestError } from './netlify-request';

export const handleApiError = (e: any) => {
  if ('data' in e) {
    const error = e as NetlifyRequestError;

    return toast(error.data.error.message, {
      type: 'error',
    });
  }

  console.error(e);

  return toast('Something went wrong', {
    type: 'error',
  });
};
