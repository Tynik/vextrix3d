import type { ListOptions } from '@netlify/blobs';
import { camelToDashCase } from '@react-hive/honey-utils';

import type { GetNetlifyStoreRecordsOptions } from './helpers';
import type { DashCase, Nullable, NullableStringKeys } from '../types';
import {
  cleanupStoreRecordConstraints,
  NETLIFY_STORE_CONSTRAINTS_PROCESSORS_MAP,
} from './constraints';
import { NetlifyStoreError } from './errors';
import { getNetlifyStore, getNetlifyStoreRecords } from './helpers';

export type NetlifyStoreName = string;

export type NetlifyStoreRecord = object;

interface NetlifyStoreEnhancedRecordConstraint {
  type: 'unique';
  key: string;
}

export type NetlifyStoreEnhancedRecord<StoreRecord extends NetlifyStoreRecord> = StoreRecord & {
  __constraints__: NetlifyStoreEnhancedRecordConstraint[];
};

export type NetlifyStoreConstraintType = 'unique' | 'foreignKey';

type RevertConstraintProcessor = () => Promise<void>;

export type NetlifyStoreConstraintProcessor<
  StoresDefinition extends NetlifyStoresDefinition,
  Constraint extends NetlifyStoreConfigConstraint<StoresDefinition, StoreName>,
  StoreName extends keyof StoresDefinition = keyof StoresDefinition,
> = (
  storeName: DashCase<NetlifyStoreName>,
  constraint: Constraint,
  record: NetlifyStoreEnhancedRecord<Partial<StoresDefinition[StoreName]>>,
) => Promise<RevertConstraintProcessor>;

export interface NetlifyStoreConfigUniqueConstraint<
  StoresDefinition extends NetlifyStoresDefinition,
  StoreName extends keyof StoresDefinition = keyof StoresDefinition,
> {
  type: 'unique';
  fields: NullableStringKeys<StoresDefinition[StoreName]>[];
}

export interface NetlifyStoreConfigForeignKeyConstraint<
  StoresDefinition extends NetlifyStoresDefinition,
  StoreName extends keyof StoresDefinition,
> {
  type: 'foreignKey';
  field:
    | NullableStringKeys<StoresDefinition[StoreName]>
    | NullableStringKeys<StoresDefinition[StoreName]>[];
  store: Exclude<keyof StoresDefinition, StoreName>;
  /**
   * @default false
   */
  isAllowEmpty?: boolean;
}

type NetlifyStoreConfigConstraint<
  StoresDefinition extends NetlifyStoresDefinition,
  StoreName extends keyof StoresDefinition,
> =
  | NetlifyStoreConfigUniqueConstraint<StoresDefinition, StoreName>
  | NetlifyStoreConfigForeignKeyConstraint<StoresDefinition, StoreName>;

interface NetlifyStoreConfig<
  StoresDefinition extends NetlifyStoresDefinition,
  StoreName extends keyof StoresDefinition,
> {
  constraints?: NetlifyStoreConfigConstraint<StoresDefinition, StoreName>[];
  onAfterDelete?: (record: StoresDefinition[StoreName]) => Promise<void>;
}

export type NetlifyStoresDefinition = Record<NetlifyStoreName, NetlifyStoreRecord>;

type NetlifyStoresConfig<StoresDefinition extends NetlifyStoresDefinition> = {
  [StoreName in keyof StoresDefinition]: NetlifyStoreConfig<StoresDefinition, StoreName>;
};

interface NetlifyStoreApi<Record extends NetlifyStoreRecord> {
  get: (key: string) => Promise<Nullable<Record>>;
  create: (key: string, record: Record) => Promise<Record>;
  update: (key: string, record: Partial<Record>) => Promise<Record>;
  delete: (key: string) => Promise<void>;
  getList: (
    listOptions?: Omit<ListOptions, 'paginate'>,
    options?: GetNetlifyStoreRecordsOptions,
  ) => Promise<Record[]>;
}

type NetlifyStoresApi<StoresDefinition extends NetlifyStoresDefinition> = {
  [StoreName in keyof StoresDefinition]: NetlifyStoreApi<StoresDefinition[StoreName]>;
};

const createStoreApi = <
  StoresDefinition extends NetlifyStoresDefinition,
  StoreName extends keyof StoresDefinition,
>(
  storeName: StoreName,
  storeConfig: NetlifyStoreConfig<StoresDefinition, StoreName>,
): NetlifyStoreApi<StoresDefinition[StoreName]> => {
  const netlifyStoreName = camelToDashCase(String(storeName)) as DashCase<NetlifyStoreName>;

  const store = getNetlifyStore({
    name: netlifyStoreName,
  });

  const executeConstraints = async <Record extends Partial<StoresDefinition[StoreName]>>(
    record: Record,
  ) => {
    const enhancedRecord: NetlifyStoreEnhancedRecord<Record> = {
      ...record,
      __constraints__: [],
    };

    const constraintTasksResult = await Promise.allSettled(
      storeConfig.constraints?.map(async constraint => {
        const constraintProcessor = NETLIFY_STORE_CONSTRAINTS_PROCESSORS_MAP[constraint.type];

        return constraintProcessor(netlifyStoreName, constraint, enhancedRecord);
      }) ?? [],
    );

    const failedConstraintTasks = constraintTasksResult.filter(
      constraintResult => constraintResult.status === 'rejected',
    );

    if (failedConstraintTasks.length) {
      await Promise.allSettled(
        constraintTasksResult.map(taskResult => {
          if (taskResult.status === 'fulfilled') {
            const revertConstraint = taskResult.value;
            // Only revert successful constraints
            return revertConstraint();
          }

          return Promise.resolve();
        }),
      );

      throw failedConstraintTasks[0].reason;
    }

    return enhancedRecord;
  };

  const get = async <Record extends StoresDefinition[StoreName]>(key: string) => {
    const enhancedRecord = (await store.get(key, {
      type: 'json',
    })) as Nullable<NetlifyStoreEnhancedRecord<Record>>;

    if (enhancedRecord) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __constraints__, ...record } = enhancedRecord;

      return record as Record;
    }

    return null;
  };

  const create = async <Record extends StoresDefinition[StoreName]>(
    key: string,
    record: Record,
  ) => {
    const enhancedRecord = await executeConstraints(record);

    await store.setJSON(key, enhancedRecord);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __constraints__, ...nextRecord } = enhancedRecord;

    return nextRecord as Record;
  };

  const update = async <Record extends StoresDefinition[StoreName]>(
    key: string,
    record: Partial<Record>,
  ) => {
    const enhancedRecord = await executeConstraints(record);

    const previousEnhancedRecord = (await store.get(key, {
      type: 'json',
    })) as Nullable<NetlifyStoreEnhancedRecord<Record>>;

    if (!previousEnhancedRecord) {
      throw new NetlifyStoreError({
        status: 'error',
        statusCode: 400,
        data: {
          error: `Record by the key "${key}" does not exist`,
        },
      });
    }

    await cleanupStoreRecordConstraints(previousEnhancedRecord);

    const nextEnhancedRecord: NetlifyStoreEnhancedRecord<Record> = {
      ...previousEnhancedRecord,
      ...enhancedRecord,
      // Merge constraints
      __constraints__: [
        ...(previousEnhancedRecord.__constraints__ ?? []),
        ...enhancedRecord.__constraints__,
      ],
    };

    await store.setJSON(key, nextEnhancedRecord);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __constraints__, ...nextRecord } = nextEnhancedRecord;

    return nextRecord as Record;
  };

  const deleteRecord = async <Record extends StoresDefinition[StoreName]>(key: string) => {
    const enhancedRecord = (await store.get(key, {
      type: 'json',
    })) as Nullable<NetlifyStoreEnhancedRecord<Record>>;

    if (!enhancedRecord) {
      throw new NetlifyStoreError({
        status: 'error',
        statusCode: 400,
        data: {
          error: `Record by the key "${key}" does not exist`,
        },
      });
    }

    await Promise.all([cleanupStoreRecordConstraints(enhancedRecord), store.delete(key)]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { __constraints__, ...record } = enhancedRecord;

    await storeConfig.onAfterDelete?.(record as Record);
  };

  const getList = async <Record extends StoresDefinition[StoreName]>(
    listOptions?: Omit<ListOptions, 'paginate'>,
    options?: GetNetlifyStoreRecordsOptions,
  ) => {
    const records = await getNetlifyStoreRecords<NetlifyStoreEnhancedRecord<Record>>(
      store,
      listOptions,
      options,
    );

    return records.map(enhancedRecord => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { __constraints__, ...record } = enhancedRecord;

      return record as Record;
    });
  };

  return {
    get,
    create,
    update,
    getList,
    delete: deleteRecord,
  };
};

export const defineNetlifyStores = <StoresDefinition extends NetlifyStoresDefinition>(
  storesConfig: NetlifyStoresConfig<StoresDefinition>,
): NetlifyStoresApi<StoresDefinition> => {
  return Object.keys(storesConfig).reduce<NetlifyStoresApi<StoresDefinition>>(
    (storesApi, storeNameKey) => {
      const storeName = storeNameKey as keyof StoresDefinition;

      storesApi[storeName] = createStoreApi(storeName, storesConfig[storeName]);

      return storesApi;
    },
    {} as never,
  );
};
