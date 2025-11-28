import type { HTMLAttributes } from 'react';

import { css, resolveColor, styled } from '@react-hive/honey-style';

export interface BackdropStyledProps extends HTMLAttributes<HTMLDivElement> {
  show: boolean;
}

export const BackdropStyled = styled('div')<BackdropStyledProps>`
  ${({ show }) => css`
    position: absolute;

    inset: 0;

    opacity: ${show ? 1 : 0};
    background-color: ${resolveColor('neutral.black', 0.7)};
    pointer-events: ${show ? 'auto' : 'none'};

    transition-property: opacity, background-color;
    transition-timing-function: ease-in-out;
    transition-duration: 250ms;
  `}
`;
