import type { HoneyBoxProps } from '@react-hive/honey-layout';
import { HoneyBox } from '@react-hive/honey-layout';
import { css, styled } from '@react-hive/honey-style';

export const IconButton = styled<HoneyBoxProps<'button'>>(HoneyBox, ({ $padding = 0.5 }) => ({
  $padding,
  as: 'button',
}))`
  ${({ theme: { colors } }) => css`
    @honey-center {
      cursor: pointer;

      border: none;
      border-radius: 4px;
      background-color: unset;
    }

    &:hover {
      background-color: ${colors.neutral.grayLight};
    }
  `}
`;
