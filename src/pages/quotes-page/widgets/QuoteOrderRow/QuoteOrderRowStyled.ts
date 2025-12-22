import { css, styled } from '@react-hive/honey-style';

import type { OrderStatus } from '~/netlify/types';

const ORDER_STATUS_GRADIENT: Record<OrderStatus, string> = {
  new: `
    linear-gradient(
      90deg,
      rgba(0, 191, 166, 0.12) 0%,
      rgba(0, 191, 166, 0.04) 35%,
      rgba(0, 191, 166, 0.00) 70%
    )
  `,
  paid: `
    linear-gradient(
      90deg,
      rgba(0, 168, 107, 0.14) 0%,
      rgba(0, 168, 107, 0.05) 35%,
      rgba(0, 168, 107, 0.00) 70%
    )
  `,
  inProduction: `
    linear-gradient(
      90deg,
      rgba(63, 125, 255, 0.14) 0%,
      rgba(63, 125, 255, 0.05) 35%,
      rgba(63, 125, 255, 0.00) 70%
    )
  `,
  shipped: `
    linear-gradient(
      90deg,
      rgba(63, 125, 255, 0.12) 0%,
      rgba(63, 125, 255, 0.04) 35%,
      rgba(63, 125, 255, 0.00) 70%
    )
  `,
  completed: `
    linear-gradient(
      90deg,
      rgba(143, 255, 193, 0.18) 0%,
      rgba(143, 255, 193, 0.07) 35%,
      rgba(143, 255, 193, 0.00) 70%
    )
  `,
  cancelled: `
    linear-gradient(
      90deg,
      rgba(255, 92, 92, 0.12) 0%,
      rgba(255, 92, 92, 0.05) 35%,
      rgba(255, 92, 92, 0.00) 70%
    )
  `,
  refunded: `
    linear-gradient(
      90deg,
      rgba(255, 92, 92, 0.08) 0%,
      rgba(255, 92, 92, 0.03) 35%,
      rgba(255, 92, 92, 0.00) 70%
    )
  `,
  expired: `
    linear-gradient(
      90deg,
      rgba(167, 171, 179, 0.14) 0%,
      rgba(167, 171, 179, 0.05) 35%,
      rgba(167, 171, 179, 0.00) 70%
    )
  `,
};

interface QuoteOrderRowStyledProps {
  status: OrderStatus;
}

export const QuoteOrderRowStyled = styled('div')<QuoteOrderRowStyledProps>`
  ${({ status, theme: { colors } }) => css`
    display: flex;
    align-items: center;
    gap: ${1};
    flex-wrap: wrap;

    padding: ${1};

    border-radius: 4px;
    border: 1px solid ${colors.neutral.grayLight};
    background: ${ORDER_STATUS_GRADIENT[status]};

    cursor: auto;

    &:hover {
      background: ${ORDER_STATUS_GRADIENT[status].replace('0.00', '0.08')};
    }
  `}
`;
