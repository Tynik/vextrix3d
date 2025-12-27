import { HoneyFlex } from '@react-hive/honey-layout';
import type { HoneyBoxProps } from '@react-hive/honey-layout';
import type { HoneyFontName } from '@react-hive/honey-style';
import { resolveFont, styled } from '@react-hive/honey-style';

type AlertSeverity = 'info' | 'success' | 'error' | 'warning';

const SEVERITIES_CONFIG: Record<AlertSeverity, Omit<HoneyBoxProps, 'as'>> = {
  info: {
    $borderColor: 'primary.aquaMintPulse',
    $backgroundColor: 'primary.mintGlow',
  },
  success: {
    $borderColor: 'success.emeraldGreen',
    $backgroundColor: 'success.mintGreen',
  },
  error: {
    $borderColor: 'error.signalCoral',
    $backgroundColor: 'error.signalCoralSoft',
  },
  warning: {
    $borderColor: 'warning.amber',
    $backgroundColor: 'warning.orange',
  },
};

interface AlertProps extends HoneyBoxProps {
  severity: AlertSeverity;
  font?: HoneyFontName;
}

export const Alert = styled<AlertProps>(HoneyFlex, ({ severity }) => ({
  $padding: 2,
  $borderRadius: '4px',
  $border: '1px solid',
  ...SEVERITIES_CONFIG[severity],
}))<AlertProps>`
  ${({ font = 'body1' }) => resolveFont(font)}
`;
