import type { HoneyBoxProps } from '@react-hive/honey-layout';
import { HoneyBox } from '@react-hive/honey-layout';
import { resolveColor } from '@react-hive/honey-style';
import type { HoneyColor, HoneyCSSDimensionValue } from '@react-hive/honey-style';
import { css, styled } from '@react-hive/honey-style';

type ButtonColor = 'primary' | 'secondary' | 'accent' | 'success';

type ButtonSize = 'small' | 'medium' | 'large';

const SIZES_MAP: Record<ButtonSize, HoneyCSSDimensionValue> = {
  small: '80px',
  medium: '120px',
  large: '160px',
};

interface ColorConfig {
  backgroundColor: HoneyColor;
  hover: HoneyColor;
  color: HoneyColor;
  border: HoneyColor;
}

const COLORS_MAP: Record<ButtonColor, ColorConfig> = {
  primary: {
    backgroundColor: 'primary.primaryIndigo', // #5D6FFF
    hover: '#4B5EDB',
    color: 'neutral.white',
    border: '#4B5EDB',
  },
  secondary: {
    backgroundColor: 'secondary.slateAlloy', // #5C6470
    hover: '#4B5360',
    color: 'neutral.white',
    border: '#4B5360',
  },
  accent: {
    backgroundColor: 'primary.aquaMintPulse', // #00BFA6
    hover: '#00A58F',
    color: 'neutral.white',
    border: '#009A85',
  },
  success: {
    backgroundColor: 'success.emeraldGreen', // #00A86B
    hover: '#008E58',
    color: 'neutral.white',
    border: '#007A4B',
  },
};

type ButtonProps = HoneyBoxProps<'button'> & {
  size?: ButtonSize;
  color?: ButtonColor;
};

export const Button = styled<ButtonProps>(
  HoneyBox,
  ({ as = 'button', type = 'button', $height = '34px' }) => ({
    as,
    type,
    $height,
  }),
)<ButtonProps>`
  ${({ size = 'medium', color = 'primary' }) => {
    const colorConfig = COLORS_MAP[color];

    return css`
      @honey-center {
        width: ${SIZES_MAP[size]};

        flex-shrink: 0;

        border-radius: 4px;
        border: 1px solid ${resolveColor(colorConfig.border)};

        font-size: 16px;

        color: ${resolveColor(colorConfig.color)};
        background-color: ${resolveColor(colorConfig.backgroundColor)};
      }

      &:hover {
        background-color: ${resolveColor(colorConfig.hover)};
      }

      &:not(:disabled) {
        cursor: pointer;
      }
    `;
  }}
`;
