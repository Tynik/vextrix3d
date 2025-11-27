import type { ElementType } from 'react';
import type { HoneyBoxProps } from '@react-hive/honey-layout';
import { HoneyBox } from '@react-hive/honey-layout';
import type { HoneyFonts } from '@react-hive/honey-style';
import { css, resolveFont, styled } from '@react-hive/honey-style';

type TextShadow = 'none' | 'soft' | 'medium' | 'strong';

const SHADOWS_CONFIG: Record<TextShadow, string> = {
  none: 'none',
  soft: '1px 1px 2px rgba(0, 0, 0, 0.25)',
  medium: '2px 2px 4px rgba(0, 0, 0, 0.35)',
  strong: '3px 3px 6px rgba(0, 0, 0, 0.5)',
};

export type TextProps<Element extends ElementType = 'p'> = HoneyBoxProps<Element> & {
  variant: keyof HoneyFonts;
  shadow?: TextShadow;
};

export const Text = styled<TextProps>(HoneyBox, ({ as = 'p', $color = 'secondary.carbonInk' }) => ({
  as,
  $color,
}))<TextProps>`
  ${({ variant, shadow = 'none' }) => css`
    ${resolveFont(variant)};

    text-shadow: ${SHADOWS_CONFIG[shadow]};
  `}
`;
