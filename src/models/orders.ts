import { doc, onSnapshot } from 'firebase/firestore';

import { firestore } from '~/firebase';

export const listenToOrder = (
  orderId: string,
  onChange: (data: any) => void,
  onError?: (error: Error) => void,
) => {
  const ref = doc(firestore, 'orders', orderId);

  return onSnapshot(
    ref,
    snap => {
      if (!snap.exists()) {
        return;
      }

      if (!snap.metadata.hasPendingWrites && snap.metadata.fromCache) {
        return;
      }

      onChange(snap.data());
    },
    onError,
  );
};
