import React from 'react';
import type { ComponentProps } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@react-hive/honey-style';

import type { TextProps } from '~/components';
import { Text } from '~/components';

export type LinkProps = ComponentProps<typeof RouterLink> & TextProps;

const LinkStyled = styled(
  RouterLink,
  {},
  {
    omitProps: name => name.startsWith('$'),
  },
)<LinkProps>``;

export const Link = (props: LinkProps) => <Text as={LinkStyled} {...props} />;
