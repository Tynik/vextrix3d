import type { HoneyBoxProps } from '@react-hive/honey-layout';
import { HoneyBox } from '@react-hive/honey-layout';
import { pxToRem, resolveColor } from '@react-hive/honey-style';
import type { HoneyColor, HoneyCSSDimensionValue } from '@react-hive/honey-style';
import { css, styled } from '@react-hive/honey-style';
import type { ElementType } from 'react';

type ButtonColor = 'primary' | 'secondary' | 'accent' | 'success';

type ButtonSize = 'small' | 'medium' | 'large';

const SIZES_MAP: Record<ButtonSize, HoneyCSSDimensionValue> = {
  small: '80px',
  medium: '120px',
  large: '160px',
};

interface ColorsConfig {
  backgroundColor: HoneyColor;
  hover: HoneyColor;
  color: HoneyColor;
  border: HoneyColor;
}

const COLORS_CONFIG: Record<ButtonColor, ColorsConfig> = {
  primary: {
    backgroundColor: 'primary.primaryIndigo',
    hover: '#4B5EDB',
    color: 'neutral.white',
    border: '#4B5EDB',
  },
  secondary: {
    backgroundColor: 'secondary.slateAlloy',
    hover: '#4B5360',
    color: 'neutral.white',
    border: '#4B5360',
  },
  accent: {
    backgroundColor: 'primary.aquaMintPulse',
    hover: '#00A58F',
    color: 'neutral.white',
    border: '#009A85',
  },
  success: {
    backgroundColor: 'success.emeraldGreen',
    hover: '#008E58',
    color: 'neutral.white',
    border: '#007A4B',
  },
};

export type ButtonStyledProps<Element extends ElementType = 'button'> = HoneyBoxProps<Element> & {
  size?: ButtonSize;
  color?: ButtonColor;
};

export const ButtonStyled = styled<ButtonStyledProps>(
  HoneyBox,
  ({ as = 'button', type = 'button', $height = { xs: '42px', md: '34px' } }) => ({
    as,
    type,
    $height,
  }),
)<ButtonStyledProps>`
  ${({ size = 'medium', color = 'primary' }) => {
    const colorConfig = COLORS_CONFIG[color];

    return css`
      @honey-center {
        width: ${SIZES_MAP[size]};

        gap: ${0.5};
        flex-shrink: 0;

        border-radius: 4px;
        border: 1px solid ${resolveColor(colorConfig.border)};

        font-size: ${pxToRem(16)};

        color: ${resolveColor(colorConfig.color)};
        background-color: ${resolveColor(colorConfig.backgroundColor)};

        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);

        transition-property: background-color, box-shadow;
        transition-duration: 0.2s;
        transition-timing-function: ease;
      }

      &:disabled {
        opacity: 0.6;
        box-shadow: none;
        cursor: not-allowed;
      }

      &:not(:disabled) {
        cursor: pointer;

        &:active {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        &:hover {
          background-color: ${resolveColor(colorConfig.hover)};
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);
        }
      }
    `;
  }}
`;
