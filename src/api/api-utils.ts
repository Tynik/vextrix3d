import { toast } from 'react-toastify';

import { NetlifyRequestErrorResponse } from './netlify-request';

export const handleApiError = (e: any) => {
  if ('data' in e) {
    return toast((e as NetlifyRequestErrorResponse).data.error, {
      type: 'error',
    });
  }

  console.error(e);

  return toast('Something went wrong', {
    type: 'error',
  });
};
