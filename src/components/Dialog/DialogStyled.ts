import { css, resolveFont, styled } from '@react-hive/honey-style';
import { bpMedia, HoneyOverlay, honeyVisibilityTransitionEffect } from '@react-hive/honey-layout';

export const DIALOG_TRANSITION_DURATION_MS = 250;

const TOP_PERCENTAGE = '50%';

export const DialogStyled = styled(HoneyOverlay)`
  ${({ theme: { colors } }) => css`
    ${honeyVisibilityTransitionEffect({
      durationMs: DIALOG_TRANSITION_DURATION_MS,
    })};

    position: fixed;

    left: 0;
    top: 0;
    right: 0;
    bottom: 0;

    z-index: 999;

    > .dialog__body {
      position: absolute;

      display: flex;
      flex-direction: column;

      max-width: 1200px;
      max-height: calc(100% - ${TOP_PERCENTAGE} - 24px);

      left: 50%;
      top: ${TOP_PERCENTAGE};

      transform: translate(-50%, -50%);
      background-color: white;

      border-radius: 8px;
      border: 1px solid ${colors.neutral.grayMedium};
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

      overflow: hidden;

      > .dialog__title {
        ${resolveFont('h6')}

        position: relative;

        padding: ${2};

        &:after {
          position: absolute;
          content: ' ';

          display: block;
          left: 0;
          bottom: 0;
          width: 100%;

          border-bottom: 1px solid ${colors.neutral.grayLight};
        }
      }

      > .dialog__content {
        @honey-stack {
          padding: ${2};
          flex-grow: 1;

          overflow-y: auto;
        }
      }
    }

    ${bpMedia('sm').down} {
      > .dialog__body {
        inset: 0;

        max-height: 100%;

        border-radius: 0;
        transform: none;
      }
    }
  `}
`;
