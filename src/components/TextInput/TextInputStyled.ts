import type { HoneyBoxProps } from '@react-hive/honey-layout';
import { HoneyBox } from '@react-hive/honey-layout';
import { css, resolveFont, styled } from '@react-hive/honey-style';

export type TextInputStyledProps = HoneyBoxProps;

export const TextInputStyled = styled(HoneyBox)`
  ${({ theme: { colors } }) => css`
    @honey-stack (2px);

    label {
      ${resolveFont('body2')};

      color: ${colors.secondary.carbonInk};

      &:has(~ input:focus) {
        //
      }
    }

    input,
    textarea {
      ${resolveFont('body1')};

      padding: 8px;

      border: 1px solid ${colors.neutral.grayLight};
      border-radius: 4px;
      color: ${colors.secondary.carbonInk};

      &:-webkit-autofill {
        -webkit-background-clip: text;
      }

      &:has(~ .text-input__error) {
        border-color: ${colors.error.signalCoral};
      }
    }

    input::placeholder,
    textarea::placeholder {
      font-size: 14px;
      font-style: italic;
      color: ${colors.neutral.grayMedium};
      font-family: Roboto, sans-serif;
    }

    textarea {
      min-height: 120px;
      resize: vertical;
    }

    .text-input__error {
      @honey-center (vertical) {
        ${resolveFont('caption1')}

        gap: ${0.5};
        color: ${colors.error.crimsonRed};
      }
    }
  `}
`;
