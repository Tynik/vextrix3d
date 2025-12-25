import React from 'react';
import type { ReactNode } from 'react';
import { isNilOrEmptyString } from '@react-hive/honey-utils';
import type { HoneyListProps, HoneyListItem, HoneyFlexProps } from '@react-hive/honey-layout';
import { HoneyFlex, HoneyList } from '@react-hive/honey-layout';

import type { TextProps } from '~/components';
import { Text } from '~/components';

export interface InfoTableRow {
  label: string;
  value: ReactNode;
  visible?: boolean;
}

interface InfoTableProps<Item extends HoneyListItem> extends Omit<
  HoneyListProps<Item>,
  'children' | 'items' | 'itemKey'
> {
  rows: InfoTableRow[];
  textVariant?: TextProps['variant'];
  rowProps?: HoneyFlexProps;
  rowLabelProps?: Omit<TextProps, 'variant'>;
}

export const InfoTable = <Item extends HoneyListItem>({
  rows,
  textVariant = 'body2',
  rowProps,
  rowLabelProps,
  ...props
}: InfoTableProps<Item>) => {
  return (
    <HoneyList items={rows} itemKey="label" $gap={1} data-testid="user-profile" {...props}>
      {row =>
        row.visible !== false && (
          // 24px height set because a icon button put inside a row can increase the row's height
          <HoneyFlex row centerY $gap={2} $minHeight="24px" {...rowProps}>
            <Text variant={textVariant} {...rowLabelProps}>
              {row.label}:
            </Text>

            {isNilOrEmptyString(row.value) ? (
              <Text variant={textVariant} $color="neutral.grayMedium" $fontStyle="italic">
                Empty
              </Text>
            ) : (
              <Text
                variant={textVariant}
                $display="flex"
                $gap={1}
                $alignItems="center"
                $overflow="hidden"
              >
                {row.value}
              </Text>
            )}
          </HoneyFlex>
        )
      }
    </HoneyList>
  );
};
