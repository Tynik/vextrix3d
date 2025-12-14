import React, { cloneElement } from 'react';
import type { ReactElement } from 'react';
import type { HoneyBoxProps } from '@react-hive/honey-layout';
import { HoneyBox } from '@react-hive/honey-layout';
import { css, styled } from '@react-hive/honey-style';

import type { IconProps } from '~/components';

interface IconButtonStyledProps extends HoneyBoxProps<'button'> {
  variant?: 'light' | 'dark';
}

const IconButtonStyled = styled<IconButtonStyledProps>(HoneyBox, ({ $padding = 0.5 }) => ({
  $padding,
  as: 'button',
}))<IconButtonStyledProps>`
  ${({ variant = 'light', theme: { colors } }) => css`
    @honey-center {
      border: none;
      border-radius: 4px;
      background-color: unset;
    }

    &:not(:disabled) {
      cursor: pointer;

      &:hover {
        background-color: ${variant === 'light'
          ? colors.neutral.grayLight
          : colors.secondary.slateAlloy};
      }
    }
  `}
`;

interface IconButtonProps extends Omit<IconButtonStyledProps, 'children'> {
  icon?: ReactElement<IconProps>;
  iconProps?: IconProps;
}

export const IconButton = ({ icon, iconProps, ...props }: IconButtonProps) => {
  return (
    <IconButtonStyled {...props}>
      {icon &&
        cloneElement(icon, {
          size: 'medium',
          ...iconProps,
        })}
    </IconButtonStyled>
  );
};
