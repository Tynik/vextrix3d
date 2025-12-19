import React from 'react';
import type { HoneyFlexProps } from '@react-hive/honey-layout';
import { HoneyBox, HoneyFlex } from '@react-hive/honey-layout';

import { Text } from '~/components';

export interface IllustrationProps extends HoneyFlexProps {
  title?: string;
  image: string;
  widthPx: number;
  heightPx: number;
}

export const Illustration = ({ title, image, widthPx, heightPx, ...props }: IllustrationProps) => {
  return (
    <HoneyFlex centerX $gap={2} {...props}>
      <HoneyBox
        $flexShrink={0}
        $width={`${widthPx}px`}
        $height={`${heightPx}px`}
        $backgroundImage={`url('/assets/images/${image}')`}
        $backgroundSize="cover"
      />

      {title && <Text variant="subtitle1">{title}</Text>}
    </HoneyFlex>
  );
};
