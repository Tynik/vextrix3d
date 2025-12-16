import { css, pxToRem, styled } from '@react-hive/honey-style';

export const CheckboxStyled = styled('label')`
  ${({ theme: { colors } }) => css`
    display: inline-flex;
    align-items: center;
    gap: ${1};

    cursor: pointer;
    user-select: none;

    &[aria-disabled='true'] {
      cursor: not-allowed;
    }

    input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }

    .checkbox {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      width: 18px;
      height: 18px;

      border-radius: 4px;
      border: 1px solid ${colors.neutral.grayLight};

      transition: all 0.15s ease;
      background: transparent;
    }

    /* Checkmark */
    .checkbox::after {
      content: '';

      width: 10px;
      height: 10px;

      border-radius: 2px;
      background: ${colors.primary.aquaMintPulse};

      transform: scale(0);
      transition: transform 0.15s ease;
    }

    /* Checked state */
    input:checked + .checkbox {
      border-color: ${colors.primary.aquaMintPulse};
    }

    input:checked + .checkbox::after {
      transform: scale(1);
    }

    input:disabled + .checkbox {
      opacity: 0.5;
    }

    .label {
      font-size: ${pxToRem(14)};
      color: ${colors.secondary.slateAlloy};
    }
  `}
`;
