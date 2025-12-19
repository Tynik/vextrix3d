import React from 'react';

import type { IllustrationProps } from '~/components';
import { Illustration } from '~/components';

export const EmptyContentIllustration = (
  props: Omit<IllustrationProps, 'illustration' | 'widthPx' | 'heightPx'>,
) => {
  return (
    <Illustration
      title="No quotes yet"
      subtitle="You haven't requested any quotes"
      illustration="no-quotes.png"
      widthPx={200}
      heightPx={200}
      {...props}
    />
  );
};
