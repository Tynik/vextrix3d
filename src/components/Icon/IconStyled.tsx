import type { SVGAttributes } from 'react';
import type { HoneyColorKey, HoneyCSSDimensionValue } from '@react-hive/honey-style';
import { css, styled, resolveColor } from '@react-hive/honey-style';

type IconSize = 'small' | 'medium' | 'large';

export type IconStyledProps = SVGAttributes<SVGElement> & {
  $size?: IconSize;
  $color?: HoneyColorKey;
  $rotate?: 90 | 180;
};

const SIZES_MAP: Record<IconSize, HoneyCSSDimensionValue> = {
  small: '16px',
  medium: '24px',
  large: '32px',
};

export const IconStyled = styled('svg')<IconStyledProps>`
  ${({ width, height, $color = 'neutral.black', $size = 'medium', $rotate, stroke, scale }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    transition: all 0.3s linear;

    width: ${width ?? SIZES_MAP[$size]};
    height: ${height ?? SIZES_MAP[$size]};

    transform: ${$rotate && `rotate(${$rotate}deg)`} scale(${scale || 1});

    &,
    path,
    rect {
      stroke: ${stroke};
      fill: ${$color && resolveColor($color)};
    }
  `};
`;
