import type { HoneyBoxProps } from '@react-hive/honey-layout';
import { HoneyBox } from '@react-hive/honey-layout';
import { css, styled } from '@react-hive/honey-style';

interface IconButtonProps extends HoneyBoxProps<'button'> {
  variant?: 'light' | 'dark';
}

export const IconButton = styled<IconButtonProps>(HoneyBox, ({ $padding = 0.5 }) => ({
  $padding,
  as: 'button',
}))<IconButtonProps>`
  ${({ variant = 'light', theme: { colors } }) => css`
    @honey-center {
      border: none;
      border-radius: 4px;
      background-color: unset;
    }

    &:not(:disabled) {
      cursor: pointer;

      &:hover {
        background-color: ${variant === 'light'
          ? colors.neutral.grayLight
          : colors.secondary.slateAlloy};
      }
    }
  `}
`;
