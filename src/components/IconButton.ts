import type { HoneyBoxProps } from '@react-hive/honey-layout';
import { HoneyBox } from '@react-hive/honey-layout';
import { css, styled } from '@react-hive/honey-style';

export const IconButton = styled<HoneyBoxProps<'button'>>(HoneyBox, ({ $padding = 0.5 }) => ({
  $padding,
  as: 'button',
}))`
  ${({ theme: { colors } }) => css`
    @honey-center {
      border: none;
      border-radius: 4px;
      background-color: unset;
    }

    &:not(:disabled) {
      cursor: pointer;

      &:hover {
        background-color: ${colors.neutral.grayLight};
      }
    }
  `}
`;
