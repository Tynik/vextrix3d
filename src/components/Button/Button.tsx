import React, { cloneElement } from 'react';
import type { ElementType, ReactElement } from 'react';

import type { IconProps } from '~/components';
import { Progress } from '~/components';
import type { ButtonStyledProps } from './ButtonStyled';
import { ButtonStyled } from './ButtonStyled';

export type ButtonProps<Element extends ElementType = 'button'> = ButtonStyledProps<Element> & {
  loading?: boolean;
  icon?: ReactElement<IconProps>;
  iconProps?: IconProps;
};

export const Button = <Element extends ElementType>({
  children,
  loading,
  icon,
  iconProps,
  ...props
}: ButtonProps<Element>) => {
  return (
    // @ts-expect-error
    <ButtonStyled {...props}>
      {loading ? (
        <Progress color="neutral.white" size="16px" lineWidth="2px" />
      ) : (
        icon &&
        cloneElement(icon, {
          size: 'medium',
          ...iconProps,
        })
      )}

      {children}
    </ButtonStyled>
  );
};
