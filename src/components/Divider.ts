import { css, styled } from '@react-hive/honey-style';
import type { HoneyBoxProps } from '@react-hive/honey-layout';
import { HoneyBox } from '@react-hive/honey-layout';

export const Divider = styled(HoneyBox, {
  as: 'hr',
  'aria-hidden': 'true',
  'aria-label': 'Separator',
})<HoneyBoxProps<'hr'>>`
  ${({ theme: { colors } }) => css`
    width: 100%;

    margin: 0;
    border: none;
    border-top: 1px solid ${colors.neutral.grayLight};
  `}
`;
