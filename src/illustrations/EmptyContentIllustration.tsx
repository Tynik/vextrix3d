import React from 'react';

import type { IllustrationProps } from '~/components';
import { Illustration } from '~/components';

export const EmptyContentIllustration = (
  props: Omit<IllustrationProps, 'image' | 'widthPx' | 'heightPx'>,
) => {
  return (
    <Illustration
      title="No quotes, yet"
      image="illustrations-1.png"
      widthPx={200}
      heightPx={200}
      {...props}
    />
  );
};
