import type { ElementType } from 'react';
import type { HoneyBoxProps } from '@react-hive/honey-layout';
import { HoneyBox } from '@react-hive/honey-layout';
import type { HoneyColor, HoneyCSSDimensionValue } from '@react-hive/honey-style';
import { css, styled, pxToRem, resolveColor } from '@react-hive/honey-style';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'danger';

type ButtonSize = 'small' | 'medium' | 'large' | 'full';

const SIZES_MAP: Record<ButtonSize, HoneyCSSDimensionValue> = {
  small: '80px',
  medium: '120px',
  large: '160px',
  full: '100%',
};

interface ColorsConfig {
  backgroundColor?: HoneyColor;
  hover: HoneyColor;
  color: HoneyColor;
  border?: HoneyColor;
}

const VARIANTS_CONFIG: Record<ButtonVariant, ColorsConfig> = {
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
  danger: {
    backgroundColor: 'error.signalCoral',
    hover: 'error.crimsonRed',
    color: 'neutral.white',
    border: 'error.crimsonRed',
  },
};

export type ButtonStyledProps<Element extends ElementType = 'button'> = HoneyBoxProps<Element> & {
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export const ButtonStyled = styled<ButtonStyledProps>(
  HoneyBox,
  ({ as = 'button', type = 'button', $height = { xs: '42px', md: '36px' } }) => ({
    as,
    type,
    $height,
  }),
)<ButtonStyledProps>`
  ${({ disabled, size = 'medium', variant = 'primary' }) => {
    const config = VARIANTS_CONFIG[variant];

    return css`
      @honey-center {
        width: ${SIZES_MAP[size]};

        gap: ${0.5};
        flex-shrink: ${size !== 'full' && 0};

        border-radius: 4px;

        ${config.border
          ? css`
              border: 1px solid ${resolveColor(config.border)};
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
            `
          : css`
              border: none;
            `}

        font-size: ${pxToRem(16)};
        color: ${resolveColor(config.color)};

        background-color: ${config.backgroundColor
          ? resolveColor(config.backgroundColor)
          : 'transparent'};

        transition-property: background-color, box-shadow;
        transition-duration: 0.2s;
        transition-timing-function: ease;
      }

      ${disabled
        ? css`
            opacity: 0.6;
            box-shadow: none;
            cursor: not-allowed;
          `
        : css`
            cursor: pointer;

            &:active {
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            &:hover {
              background-color: ${resolveColor(config.hover)};
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);
            }
          `}
    `;
  }}
`;
