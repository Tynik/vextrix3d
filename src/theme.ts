import type { HoneyCSSColor, HoneyFont, HoneyTheme } from '@react-hive/honey-style';

type PrimaryColors = 'primaryIndigo' | 'aquaMintPulse' | 'mintGlow';

type SecondaryColors = 'cloudMist' | 'slateAlloy' | 'carbonInk';

type AccentColors = 'azureCurrent' | 'deepAzure' | 'duskViolet';

type NeutralColors = 'black' | 'white' | 'grayLight' | 'grayMedium' | 'grayDark';

type SuccessColors = 'mintGreen' | 'emeraldGreen';

type WarningColors = 'amber' | 'orange';

type ErrorColors = 'signalCoral' | 'crimsonRed';

declare module '@react-hive/honey-style' {
  export interface HoneyFonts {
    h1: HoneyFont;
    h2: HoneyFont;
    h3: HoneyFont;
    h4: HoneyFont;
    h5: HoneyFont;
    h6: HoneyFont;
    subtitle1: HoneyFont;
    subtitle2: HoneyFont;
    body1: HoneyFont;
    body2: HoneyFont;
    caption1: HoneyFont;
    caption2: HoneyFont;
  }

  export interface HoneyColors {
    primary: Record<PrimaryColors, HoneyCSSColor>;
    secondary: Record<SecondaryColors, HoneyCSSColor>;
    accent: Record<AccentColors, HoneyCSSColor>;
    neutral: Record<NeutralColors, HoneyCSSColor>;
    success: Record<SuccessColors, HoneyCSSColor>;
    warning: Record<WarningColors, HoneyCSSColor>;
    error: Record<ErrorColors, HoneyCSSColor>;
  }
}

export const theme: HoneyTheme = {
  breakpoints: {
    xs: 480,
    sm: 768,
    md: 992,
    lg: 1200,
  },
  container: {
    maxWidth: '1450px',
  },
  spacings: {
    base: 8,
  },
  fonts: {
    h1: { size: 52, weight: 700 },
    h2: { size: 36, weight: 700 },
    h3: { size: 28, weight: 700 },
    h4: { size: 24, weight: 700 },
    h5: { size: 22, weight: 600 },
    h6: { size: 20, weight: 600 },
    subtitle1: { size: 18, weight: 500, lineHeight: 28 },
    subtitle2: { size: 16, weight: 500, lineHeight: 24 },
    body1: { size: 16, lineHeight: 24 },
    body2: { size: 14 },
    caption1: { size: 12 },
    caption2: { size: 10 },
  },
  dimensions: {},
  colors: {
    primary: {
      primaryIndigo: '#617BFF', // Main brand blue — confidence, precision
      aquaMintPulse: '#00BFA6', // Accent — energy, freshness
      mintGlow: '#E8FBF8', // Background accent or hover
    },
    secondary: {
      cloudMist: '#F5F6FA', // Clean, light background
      slateAlloy: '#5C6470', // Secondary text / icon color
      carbonInk: '#1A1A1A', // Primary text color
    },
    accent: {
      azureCurrent: '#3F5BFF',
      deepAzure: '#2F49D8',
      duskViolet: '#6B5B95',
    },
    neutral: {
      black: '#000000',
      white: '#FFFFFF',
      grayLight: '#E6E8EC',
      grayMedium: '#A7ABB3',
      grayDark: '#2E3035',
    },
    success: {
      mintGreen: '#8FFFC1', // Soft green success state
      emeraldGreen: '#00A86B', // Stronger confirmation tone
    },
    warning: {
      amber: '#FFC107',
      orange: '#FF8C00',
    },
    error: {
      signalCoral: '#FF5C5C',
      crimsonRed: '#DC143C',
    },
  },
};
