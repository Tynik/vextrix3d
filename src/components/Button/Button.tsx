import React from 'react';
import type { ElementType } from 'react';

import { Progress } from '~/components';
import type { ButtonStyledProps } from './ButtonStyled';
import { ButtonStyled } from './ButtonStyled';

type ButtonProps<Element extends ElementType = 'button'> = ButtonStyledProps<Element> & {
  loading?: boolean;
};

export const Button = <Element extends ElementType>({
  loading,
  children,
  ...props
}: ButtonProps<Element>) => {
  return (
    // @ts-expect-error
    <ButtonStyled {...props}>
      {loading && <Progress color="neutral.white" size="16px" lineWidth="2px" />}
      {children}
    </ButtonStyled>
  );
};
