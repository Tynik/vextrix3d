import type { HoneyBoxProps } from '@react-hive/honey-layout';
import { HoneyBox } from '@react-hive/honey-layout';
import type { HoneyCSSDimensionValue } from '@react-hive/honey-style';
import { css, styled } from '@react-hive/honey-style';

interface LoadingProps extends HoneyBoxProps {
  size?: HoneyCSSDimensionValue;
  lineWidth?: HoneyCSSDimensionValue;
}

export const Progress = styled(HoneyBox, {
  role: 'status',
  'aria-live': 'polite',
  'aria-label': 'Loading...',
})<LoadingProps>`
  ${({ size = '40px', lineWidth = '4px', theme: { colors } }) => css`
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

    border: ${lineWidth} solid ${colors.primary.primaryIndigo};
    border-top-color: transparent;
    border-radius: 50%;

    animation: spin 1s linear infinite;
  `}
`;
