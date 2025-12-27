import type { ColorsConfig } from '~/types';
import type { QuoteStatus } from '~/netlify/types';

export const SUPPORTED_3D_MODEL_EXTENSIONS = ['stl', 'obj', '3mf'] as const;

export const QUOTE_STATUS_COLORS_CONFIGS: Record<QuoteStatus, ColorsConfig> = {
  new: {
    text: 'secondary.carbonInk',
    background: 'neutral.grayUltraLight',
  },
  priced: {
    text: 'neutral.white',
    background: 'accent.infoBlue',
  },
  changeRequested: {
    text: 'neutral.white',
    background: 'warning.orange',
  },
  accepted: {
    text: 'neutral.white',
    background: 'success.emeraldGreen',
  },
  rejected: {
    text: 'neutral.white',
    background: 'error.signalCoral',
  },
  expired: {
    text: 'secondary.carbonInk',
    background: 'neutral.grayLight',
  },
};
