import { bpMedia, HoneyBoxProps } from '@react-hive/honey-layout';
import { HoneyBox } from '@react-hive/honey-layout';
import { css, pxToRem, resolveFont, styled } from '@react-hive/honey-style';

export type TextInputStyledProps = HoneyBoxProps;

export const TextInputStyled = styled(HoneyBox, ({ $width = '100%' }) => ({
  $width,
}))`
  ${({ theme: { colors } }) => css`
    @honey-stack (2px);

    label {
      font-size: ${pxToRem(14)};
      color: ${colors.secondary.slateAlloy};

      &:has(~ input:focus) {
        //
      }
    }

    input {
      height: 36px;
    }

    input,
    textarea {
      padding: 8px;

      font-size: ${pxToRem(16)};
      font-family: Roboto, sans-serif;

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
      font-size: ${pxToRem(14)};
      font-style: italic;
      color: ${colors.neutral.grayMedium};
      font-family: Roboto, sans-serif;
    }

    textarea {
      min-height: 120px;
      line-height: 1.3rem;
      resize: vertical;
    }

    .text-input__error {
      @honey-center (vertical) {
        ${resolveFont('caption1')}

        gap: ${0.5};
        color: ${colors.error.crimsonRed};
      }
    }

    ${bpMedia('sm').down} {
      input {
        height: 42px;
      }
    }
  `}
`;
