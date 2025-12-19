import React from 'react';

import type { IconProps } from '../components/Icon';
import { Icon } from '../components/Icon';

export const DescriptionIcon = (props: IconProps) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8zm2 16H8v-2h8zm0-4H8v-2h8zm-3-5V3.5L18.5 9z" />
  </Icon>
);
