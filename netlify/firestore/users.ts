import admin from 'firebase-admin';
import type { DocumentReference } from 'firebase-admin/firestore';
import { assert } from '@react-hive/honey-utils';

import type { UserDocument } from './document-types';
import { USERS_COLLECTION_NAME } from './collections';
import { userConverter } from './data-convertors';

export const getUserDocumentRef = (userId: string): DocumentReference<UserDocument> =>
  admin.firestore().doc(`${USERS_COLLECTION_NAME}/${userId}`).withConverter(userConverter);

export const getExistingUserDocument = async (userId: string): Promise<UserDocument> => {
  const documentReference = getUserDocumentRef(userId);

  const documentSnapshot = await documentReference.get();
  assert(documentSnapshot.exists, 'User document does not exist');

  const userDocument = documentSnapshot.data();
  assert(userDocument, 'User document data is empty');

  return userDocument;
};
