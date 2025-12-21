import React, { cloneElement } from 'react';
import type { ElementType, ReactElement, MouseEventHandler } from 'react';

import type { IconProps } from '~/components';
import { Progress } from '~/components';
import type { ButtonStyledProps } from './ButtonStyled';
import { ButtonStyled } from './ButtonStyled';

export type ButtonProps<Element extends ElementType = 'button'> = ButtonStyledProps<Element> & {
  loading?: boolean;
  icon?: ReactElement<IconProps>;
  iconProps?: IconProps;
};

export const Button = <Element extends ElementType = 'button'>({
  children,
  loading,
  icon,
  iconProps,
  disabled,
  onClick,
  ...props
}: ButtonProps<Element>) => {
  const handleClick: MouseEventHandler<Element> = e => {
    e.stopPropagation();

    onClick?.(e);
  };

  return (
    // @ts-expect-error
    <ButtonStyled disabled={loading || disabled} {...props} onClick={handleClick}>
      {loading ? (
        <Progress color="neutral.white" size="16px" lineWidth="2px" />
      ) : (
        icon &&
        cloneElement(icon, {
          size: 'small',
          ...iconProps,
        })
      )}

      {children}
    </ButtonStyled>
  );
};
