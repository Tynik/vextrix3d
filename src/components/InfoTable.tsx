import React from 'react';
import type { ReactNode } from 'react';
import { isNilOrEmptyString } from '@react-hive/honey-utils';
import type { HoneyFlexProps } from '@react-hive/honey-layout';
import { HoneyFlex, HoneyList } from '@react-hive/honey-layout';

import { Text } from '~/components';

export interface InfoTableRow {
  label: string;
  value: ReactNode;
}

interface InfoTableProps {
  rows: InfoTableRow[];
  rowProps?: HoneyFlexProps;
}

export const InfoTable = ({ rows, rowProps }: InfoTableProps) => {
  return (
    <HoneyList items={rows} itemKey="label" $gap={1} data-testid="user-profile">
      {row => (
        <HoneyFlex row $gap={2}>
          <Text variant="body1" $fontWeight="500" {...rowProps}>
            {row.label}:
          </Text>

          {isNilOrEmptyString(row.value) ? (
            <Text variant="body1" $color="neutral.grayMedium" $fontStyle="italic">
              Empty
            </Text>
          ) : (
            <Text variant="body1" $display="flex" $gap={1} $alignItems="center" ellipsis>
              {row.value}
            </Text>
          )}
        </HoneyFlex>
      )}
    </HoneyList>
  );
};
