import React from 'react';
import type { ReactNode } from 'react';
import { isNilOrEmptyString } from '@react-hive/honey-utils';
import type { HoneyListProps, HoneyListItem } from '@react-hive/honey-layout';
import { HoneyFlex, HoneyList } from '@react-hive/honey-layout';

import type { TextProps } from '~/components';
import { Text } from '~/components';

export interface InfoTableRow {
  label: string;
  value: ReactNode;
}

interface InfoTableProps<Item extends HoneyListItem> extends Omit<
  HoneyListProps<Item>,
  'children' | 'items' | 'itemKey'
> {
  rows: InfoTableRow[];
  textVariant?: TextProps['variant'];
  rowProps?: Omit<TextProps, 'variant'>;
}

export const InfoTable = <Item extends HoneyListItem>({
  rows,
  textVariant = 'body2',
  rowProps,
  ...props
}: InfoTableProps<Item>) => {
  return (
    <HoneyList items={rows} itemKey="label" $gap={1} data-testid="user-profile" {...props}>
      {row => (
        <HoneyFlex row $gap={2}>
          <Text variant={textVariant} {...rowProps}>
            {row.label}:
          </Text>

          {isNilOrEmptyString(row.value) ? (
            <Text variant={textVariant} $color="neutral.grayMedium" $fontStyle="italic">
              Empty
            </Text>
          ) : (
            <Text variant={textVariant} $display="flex" $gap={1} $alignItems="center" ellipsis>
              {row.value}
            </Text>
          )}
        </HoneyFlex>
      )}
    </HoneyList>
  );
};
