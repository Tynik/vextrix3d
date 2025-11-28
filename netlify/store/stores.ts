import { getStorage } from 'firebase-admin/storage';

import type { FileRecord } from '../types';
import { FIREBASE_STORAGE_BUCKET } from '../constants';
import { defineNetlifyStores } from './store';

type NetlifyStores = {
  files: FileRecord;
};

export const netlifyStores = defineNetlifyStores<NetlifyStores>({
  files: {
    onAfterDelete: async fileRecord => {
      const bucket = getStorage().bucket(FIREBASE_STORAGE_BUCKET);

      const file = bucket.file(fileRecord.path);
      await file.delete();
    },
  },
});
