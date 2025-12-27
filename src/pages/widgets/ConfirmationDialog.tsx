import React from 'react';
import type { PropsWithChildren } from 'react';

import type { ButtonVariant, DialogProps } from '~/components';
import { Button, Dialog, Text } from '~/components';
import { HoneyBox, HoneyFlex } from '@react-hive/honey-layout';
import { isString } from '@react-hive/honey-utils';

type ConfirmationSeverity = 'info' | 'success' | 'danger';

interface SeverityConfig {
  confirmBtnVariant: ButtonVariant;
}

const SEVERITIES_CONFIG: Record<ConfirmationSeverity, SeverityConfig> = {
  info: {
    confirmBtnVariant: 'accent',
  },
  success: {
    confirmBtnVariant: 'success',
  },
  danger: {
    confirmBtnVariant: 'danger',
  },
};

interface ConfirmationDialogProps extends Omit<DialogProps, 'children'> {
  severity: ConfirmationSeverity;
  loading: boolean;
  onConfirm: () => void;
}

export const ConfirmationDialog = ({
  children,
  severity,
  loading,
  onConfirm,
  ...props
}: PropsWithChildren<ConfirmationDialogProps>) => {
  const { onClose } = props;

  const severityConfig = SEVERITIES_CONFIG[severity];

  return (
    <Dialog {...props}>
      <HoneyFlex $gap={2}>
        {isString(children) ? <Text variant="body1">{children}</Text> : children}

        <HoneyBox $display="flex" $gap={1} $justifyContent="flex-end" $marginTop={1}>
          <Button variant={severityConfig.confirmBtnVariant} loading={loading} onClick={onConfirm}>
            Yes
          </Button>

          <Button variant="secondary" disabled={loading} onClick={onClose}>
            No
          </Button>
        </HoneyBox>
      </HoneyFlex>
    </Dialog>
  );
};
