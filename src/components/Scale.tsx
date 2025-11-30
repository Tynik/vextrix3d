import React, { useId } from 'react';
import { css, resolveFont, styled } from '@react-hive/honey-style';

interface ScaleStyledProps {
  value: number;
  min?: number;
  max?: number;
}

const ScaleStyled = styled('div')<ScaleStyledProps>`
  ${({ value, min = 0, max = 100, theme: { colors } }) => {
    const percent = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

    return css`
      position: relative;

      display: flex;
      flex-direction: column;
      gap: ${0.5};

      width: 100%;

      > .scale__label {
        ${resolveFont('body2')};
      }

      > .scale__range {
        width: 100%;
        height: 10px;

        border: 1px solid ${colors.primary.aquaMintPulse};
        border-radius: 5px;
        overflow: hidden;

        background: linear-gradient(
          to right,
          ${colors.primary.aquaMintPulse} ${percent}%,
          ${colors.primary.mintGlow} ${percent}%
        );
      }

      > .scale__value {
        ${resolveFont('caption1')};

        transform: translateX(${percent}%);
      }
    `;
  }}
`;

interface ScaleProps extends ScaleStyledProps {
  label?: string;
  showValue?: boolean;
}

export const Scale = ({
  label,
  value,
  showValue = false,
  min = 0,
  max = 100,
  ...rest
}: ScaleProps) => {
  const labelId = useId();

  return (
    <ScaleStyled
      value={value}
      min={min}
      max={max}
      // ARIA
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-labelledby={labelId}
      role="progressbar"
      {...rest}
    >
      {label && (
        <div id={labelId} className="scale__label">
          {label}
        </div>
      )}

      <div className="scale__range" />

      {showValue && <div className="scale__value">{value}</div>}
    </ScaleStyled>
  );
};
