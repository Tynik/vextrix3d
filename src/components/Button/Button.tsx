import React, { cloneElement } from 'react';
import type { ElementType, ReactElement } from 'react';

import type { IconProps } from '~/components';
import { Progress } from '~/components';
import type { ButtonStyledProps } from './ButtonStyled';
import { ButtonStyled } from './ButtonStyled';

type ButtonProps<Element extends ElementType = 'button'> = ButtonStyledProps<Element> & {
  loading?: boolean;
  icon?: ReactElement<IconProps>;
};

export const Button = <Element extends ElementType>({
  children,
  loading,
  icon,
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
          size: 'small',
        })
      )}

      {children}
    </ButtonStyled>
  );
};
