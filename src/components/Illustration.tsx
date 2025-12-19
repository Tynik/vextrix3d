import React from 'react';
import type { HoneyFlexProps } from '@react-hive/honey-layout';
import { HoneyBox, HoneyFlex } from '@react-hive/honey-layout';

import { Text } from '~/components';

export interface IllustrationProps extends HoneyFlexProps {
  title?: string;
  subtitle?: string;
  illustration: string;
  widthPx: number;
  heightPx: number;
}

export const Illustration = ({
  title,
  subtitle,
  illustration,
  widthPx,
  heightPx,
  ...props
}: IllustrationProps) => {
  return (
    <HoneyFlex centerX $gap={2} {...props}>
      <HoneyBox
        $flexShrink={0}
        $width={`${widthPx}px`}
        $height={`${heightPx}px`}
        $backgroundImage={`url('/assets/illustrations/${illustration}')`}
        $backgroundSize="cover"
      />

      <HoneyFlex $gap={1} centerX>
        {title && <Text variant="subtitle1">{title}</Text>}

        {subtitle && (
          <Text variant="subtitle2" $color="secondary.slateAlloy">
            {subtitle}
          </Text>
        )}
      </HoneyFlex>
    </HoneyFlex>
  );
};
