import type { HoneyBoxProps } from '@react-hive/honey-layout';
import { HoneyBox } from '@react-hive/honey-layout';
import type { HoneyColorKey, HoneyCSSDimensionValue } from '@react-hive/honey-style';
import { css, styled, resolveColor } from '@react-hive/honey-style';

interface LoadingProps extends Omit<HoneyBoxProps, 'color'> {
  size?: HoneyCSSDimensionValue;
  lineWidth?: HoneyCSSDimensionValue;
  color?: HoneyColorKey;
}

export const Progress = styled(HoneyBox, {
  role: 'status',
  'aria-live': 'polite',
  'aria-label': 'Loading...',
})<LoadingProps>`
  ${({ size = '40px', lineWidth = '4px', color = 'primary.primaryIndigo' }) => css`
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    display: inline-block;

    width: ${size};
    height: ${size};

    border: ${lineWidth} solid ${resolveColor(color)};
    border-top-color: transparent;
    border-radius: 50%;

    animation: spin 1s linear infinite;
  `}
`;
