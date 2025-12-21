import React from 'react';
import type { ReactElement, ComponentProps } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { styled } from '@react-hive/honey-style';

import type { IconProps, TextProps } from '~/components';
import { Text } from '~/components';
import { HoneyBox } from '@react-hive/honey-layout';

export type LinkProps = ComponentProps<typeof RouterLink> &
  TextProps & {
    icon?: ReactElement<IconProps>;
  };

const LinkStyled = styled(
  RouterLink,
  {},
  {
    omitProps: name => name.startsWith('$'),
  },
)<LinkProps>``;

export const Link = ({ icon, ...props }: LinkProps) => {
  const component = <Text as={LinkStyled} $width="max-content" {...props} />;

  if (icon) {
    return (
      <HoneyBox $display="flex" $gap={0.5} $alignItems="center">
        {icon}
        {component}
      </HoneyBox>
    );
  }

  return component;
};
