import { camelToDashCase } from '@react-hive/honey-utils';

import type { DashCase } from '../types';
import type {
  NetlifyStoreConstraintProcessor,
  NetlifyStoreConfigForeignKeyConstraint,
  NetlifyStoreConfigUniqueConstraint,
  NetlifyStoreConstraintType,
  NetlifyStoreName,
  NetlifyStoresDefinition,
  NetlifyStoreEnhancedRecord,
  NetlifyStoreRecord,
} from './store';
import { NetlifyStoreError } from './errors';
import { getNetlifyStore } from './helpers';
import { createHexHash } from '../crypto';

export const getConstraintsStore = () => getNetlifyStore({ name: '__constraints__' });

const getUniqueConstraintKey = (storeName: DashCase<NetlifyStoreName>, constraintValue: string) =>
  `${storeName}/unique/${constraintValue}`;

const uniqueConstraintProcessor: NetlifyStoreConstraintProcessor<
  NetlifyStoresDefinition,
  NetlifyStoreConfigUniqueConstraint<NetlifyStoresDefinition, NetlifyStoreName>
> = async (storeName, constraint, record) => {
  const constraintsStore = getConstraintsStore();

  const constraintValue = constraint.fields.map(fieldName => record[fieldName]).join('-');
  const constraintKey = getUniqueConstraintKey(storeName, createHexHash(constraintValue));

  const existingRecord = await constraintsStore.get(constraintKey);
  if (existingRecord) {
    throw new NetlifyStoreError({
      status: 'error',
      statusCode: 409,
      data: {
        error: `Record with the value "${constraintValue}" already exists`,
      },
    });
  }

  await constraintsStore.set(constraintKey, '1');

  record.__constraints__.push({
    type: 'unique',
    key: constraintKey,
  });

  return async () => {
    await constraintsStore.delete(constraintKey);
  };
};

const foreignKeyConstraintProcessor: NetlifyStoreConstraintProcessor<
  NetlifyStoresDefinition,
  NetlifyStoreConfigForeignKeyConstraint<NetlifyStoresDefinition, NetlifyStoreName>
> = async (storeName, constraint, record) => {
  const fieldValue = Array.isArray(constraint.field)
    ? constraint.field.map(field => record[field]).join('/')
    : record[constraint.field];

  if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
    if (!constraint.isAllowEmpty) {
      throw new NetlifyStoreError({
        status: 'error',
        statusCode: 400,
        data: {
          error: `The field "${String(constraint.field)}" cannot be empty`,
        },
      });
    }
  } else {
    const foreignStoreName = camelToDashCase(constraint.store) as DashCase<NetlifyStoreName>;
    const foreignStore = getNetlifyStore({ name: foreignStoreName });

    const foreignRecord = await foreignStore.get(fieldValue);
    if (!foreignRecord) {
      throw new NetlifyStoreError({
        status: 'error',
        statusCode: 409,
        data: {
          error: `Foreign record by the key "${String(fieldValue)}" does not exist`,
        },
      });
    }
  }

  return async () => {
    //
  };
};

export const cleanupStoreRecordConstraints = <StoreRecord extends NetlifyStoreRecord>(
  record: NetlifyStoreEnhancedRecord<StoreRecord>,
) => {
  const constraintsStore = getConstraintsStore();

  return Promise.all(
    [...(record.__constraints__ ?? [])].map(async (recordConstraint, recordConstraintIndex) => {
      if (recordConstraint.type === 'unique') {
        await constraintsStore.delete(recordConstraint.key);

        record.__constraints__.splice(recordConstraintIndex, 1);
      }
    }),
  );
};

export const NETLIFY_STORE_CONSTRAINTS_PROCESSORS_MAP: Record<
  NetlifyStoreConstraintType,
  NetlifyStoreConstraintProcessor<NetlifyStoresDefinition, any>
> = {
  unique: uniqueConstraintProcessor,
  foreignKey: foreignKeyConstraintProcessor,
};
