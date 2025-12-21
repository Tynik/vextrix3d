import admin from 'firebase-admin';

import { getSequenceDocRef } from './document-references';

export const getNextSequence = async (key: 'quotes' | 'orders', firestore = admin.firestore()) => {
  const sequenceDocRef = getSequenceDocRef(key);

  const result = await firestore.runTransaction(async tx => {
    const docSnap = await tx.get(sequenceDocRef);

    const next = (docSnap.exists ? (docSnap.data()?.value ?? 0) : 0) + 1;

    tx.set(
      sequenceDocRef,
      {
        value: next,
      },
      {
        merge: true,
      },
    );

    return next;
  });

  return String(result).padStart(6, '0');
};
