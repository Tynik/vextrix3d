import React from 'react';

import type { QuoteStatus } from '~/netlify/types';
import type { TextProps } from '~/components';
import { Text } from '~/components';
import { QUOTE_STATUS_COLORS_CONFIGS } from '~/configs';

interface QuoteStatusInfoProps extends Omit<TextProps, 'variant'> {
  status: QuoteStatus;
}

export const QuoteStatusInfo = ({ status, ...props }: QuoteStatusInfoProps) => {
  const statusColorsConfig = QUOTE_STATUS_COLORS_CONFIGS[status];

  return (
    <Text
      variant="body2"
      $padding={[0.5, 1]}
      $borderRadius="4px"
      $color={statusColorsConfig.text}
      $backgroundColor={statusColorsConfig.background}
      $fontWeight={500}
      {...props}
    >
      {status}
    </Text>
  );
};
