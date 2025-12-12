import type { HoneyFlexProps } from '@react-hive/honey-layout';
import { HoneyFlex } from '@react-hive/honey-layout';
import { css, styled } from '@react-hive/honey-style';

export const Container = styled(HoneyFlex, {
  'data-testid': 'container',
})<HoneyFlexProps>`
  ${({ theme }) => css`
    width: 100%;
    max-width: ${theme.container.maxWidth};

    margin: 0 auto;
  `}
`;
