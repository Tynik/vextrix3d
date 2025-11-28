import type { GetStoreOptions, ListOptions, Store } from '@netlify/blobs';
import { getStore } from '@netlify/blobs';

import { IS_LOCAL_ENV, NETLIFY_TOKEN, SITE_ID } from '../constants';

export const getNetlifyStore = (
  { name, ...options }: Omit<GetStoreOptions, 'siteID' | 'token'>,
  isProd = false,
): Store =>
  getStore({
    ...options,
    name: !isProd && IS_LOCAL_ENV ? `test-${name}` : name,
    siteID: SITE_ID,
    token: NETLIFY_TOKEN,
    consistency: 'eventual',
  });

export const getNetlifyStoreRecordsByKeys = async <T>(store: Store, keys: string[]) =>
  (await Promise.all(
    keys.map(key => store.get(key, { type: 'json', consistency: 'eventual' })),
  )) as T[];

export interface GetNetlifyStoreRecordsOptions {
  offset?: number;
  limit?: number;
}

export const getNetlifyStoreRecords = async <T>(
  store: Store,
  listOptions: Omit<ListOptions, 'paginate'> = {},
  { offset = 0, limit = 1000 }: GetNetlifyStoreRecordsOptions = {},
): Promise<T[]> => {
  const listResult = store.list({ paginate: true, ...listOptions });

  const keys: string[] = [];

  let itemsCollected = 0; // Track the number of items collected across pages
  let skippedItems = 0; // Track the number of items skipped to handle offset

  for await (const entry of listResult) {
    const remainingOffset = Math.max(0, offset - skippedItems);
    const availableItems = entry.blobs.length - remainingOffset;

    if (availableItems <= 0) {
      skippedItems += entry.blobs.length; // Keep counting items for offset
    } else {
      const blobsToCollect = entry.blobs.slice(
        remainingOffset,
        remainingOffset + (limit - itemsCollected),
      );
      keys.push(...blobsToCollect.map(blob => blob.key));

      itemsCollected += blobsToCollect.length;
      skippedItems += entry.blobs.length;

      if (itemsCollected >= limit) {
        break;
      }
    }
  }

  return getNetlifyStoreRecordsByKeys<T>(store, keys);
};

export const clearNetlifyStore = async (store: Store) => {
  const listResult = await store.list();
  const keys = listResult.blobs.map(blob => blob.key);

  await Promise.all(keys.map(key => store.delete(key)));
};
