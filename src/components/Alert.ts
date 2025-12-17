import { HoneyFlex } from '@react-hive/honey-layout';
import type { HoneyBoxProps } from '@react-hive/honey-layout';
import type { HoneyFontName } from '@react-hive/honey-style';
import { resolveFont, styled } from '@react-hive/honey-style';

type AlertVariant = 'error' | 'info' | 'success' | 'warning';

const VARIANTS_CONFIG: Record<AlertVariant, Omit<HoneyBoxProps, 'as'>> = {
  error: {
    $borderColor: 'error.crimsonRed',
    $backgroundColor: 'error.signalCoral',
  },
  info: {
    $borderColor: 'primary.aquaMintPulse',
    $backgroundColor: 'primary.mintGlow',
  },
  success: {
    $borderColor: 'success.emeraldGreen',
    $backgroundColor: 'success.mintGreen',
  },
  warning: {
    $borderColor: 'warning.amber',
    $backgroundColor: 'warning.orange',
  },
};

interface AlertProps extends HoneyBoxProps {
  variant: AlertVariant;
  font?: HoneyFontName;
}

export const Alert = styled<AlertProps>(HoneyFlex, ({ variant }) => ({
  $padding: 2,
  $borderRadius: '4px',
  $border: '1px solid',
  ...VARIANTS_CONFIG[variant],
}))<AlertProps>`
  ${({ font = 'body1' }) => resolveFont(font)}
`;
