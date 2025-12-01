import React from 'react';

import type { IconProps } from '../components/Icon';
import { Icon } from '../components/Icon';

export const ShieldIcon = (props: IconProps) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5z" />
  </Icon>
);
