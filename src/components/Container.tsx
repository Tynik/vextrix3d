import type { HoneyFlexBoxProps } from '@react-hive/honey-layout';
import { HoneyFlexBox } from '@react-hive/honey-layout';
import { css, styled } from '@react-hive/honey-style';

export const Container = styled(HoneyFlexBox, {
  'data-testid': 'container',
})<HoneyFlexBoxProps>`
  ${({ theme }) => css`
    width: 100%;
    max-width: ${theme.container.maxWidth};

    margin: 0 auto;
  `}
`;
