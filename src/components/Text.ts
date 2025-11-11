import type { ElementType } from 'react';
import type { HoneyBoxProps } from '@react-hive/honey-layout';
import { HoneyBox } from '@react-hive/honey-layout';
import type { HoneyFonts } from '@react-hive/honey-style';
import { css, resolveFont, styled } from '@react-hive/honey-style';

export type TextProps<Element extends ElementType = 'p'> = HoneyBoxProps<Element> & {
  variant: keyof HoneyFonts;
};

export const Text = styled<TextProps>(HoneyBox, ({ as = 'p', $color = 'secondary.carbonInk' }) => ({
  as,
  $color,
}))<TextProps>`
  ${({ variant }) => css`
    ${resolveFont(variant)};
  `}
`;
