import { getStore } from '@netlify/blobs';

import { NETLIFY_TOKEN, SITE_ID } from './constants';

export const getSecretsStore = () =>
  getStore({
    name: 'secrets',
    siteID: SITE_ID,
    token: NETLIFY_TOKEN,
  });
