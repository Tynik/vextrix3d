import type { HoneyHEXColor } from '@react-hive/honey-style';
import { css, styled } from '@react-hive/honey-style';

interface ColorInfoProps {
  hex: HoneyHEXColor;
}

export const ColorInfo = styled('div')<ColorInfoProps>`
  ${({ hex, theme: { colors } }) => css`
    width: 16px;
    height: 16px;

    border-radius: 2px;
    background-color: ${hex};

    &[aria-disabled='true'] {
      background: repeating-linear-gradient(
        135deg,
        ${colors.neutral.grayLight} 0px,
        ${colors.neutral.grayLight} 1px,
        transparent 1px,
        transparent 4px
      );
    }
  `}
`;
