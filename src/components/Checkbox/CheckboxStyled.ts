import { css, pxToRem, styled } from '@react-hive/honey-style';

export const CheckboxStyled = styled('label')`
  ${({ theme: { colors } }) => css`
    @honey-stack (0.5);

    .checkbox__control {
      display: inline-flex;
      align-items: center;
      gap: ${1};
    }

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
      flex-shrink: 0;

      width: 18px;
      height: 18px;

      border-radius: 4px;
      border: 1px solid ${colors.neutral.grayLight};

      transition: all 0.15s ease;
      background: transparent;
    }

    &:has(.checkbox__error) .checkbox {
      border-color: ${colors.error.signalCoral};
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

    .checkbox__error {
      @honey-center (vertical) {
        gap: ${0.5};

        font-size: ${pxToRem(12)};
        color: ${colors.error.crimsonRed};
      }
    }
  `}
`;
