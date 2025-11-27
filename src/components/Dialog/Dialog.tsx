import React from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { invokeIfFunction } from '@react-hive/honey-utils';
import { HoneyLazyContent } from '@react-hive/honey-layout';

import { Backdrop } from '~/components';
import { DIALOG_TRANSITION_DURATION_MS, DialogStyled } from './DialogStyled';

interface ChildrenContextValue {
  closeDialog: () => void;
}

export interface DialogProps {
  children: ReactNode | ((context: ChildrenContextValue) => ReactNode);
  open: boolean;
  title: string;
  onClose: () => void;
}

export const Dialog = ({ children, open, title, onClose, ...props }: DialogProps) => {
  const content = (
    <DialogStyled
      active={open}
      onDeactivate={onClose}
      // ARIA
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-content"
      {...props}
    >
      {({ deactivateOverlay }) => (
        <>
          <Backdrop show={open} onClick={deactivateOverlay} />

          <div className="dialog__body">
            <div id="dialog-title" className="dialog__title">
              {title}
            </div>

            <div id="dialog-content" className="dialog__content">
              <HoneyLazyContent mount={open} unmountDelay={DIALOG_TRANSITION_DURATION_MS}>
                {invokeIfFunction(children, {
                  closeDialog: deactivateOverlay,
                })}
              </HoneyLazyContent>
            </div>
          </div>
        </>
      )}
    </DialogStyled>
  );

  return createPortal(content, document.body);
};
