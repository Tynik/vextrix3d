import React, { useEffect } from 'react';
import type { MouseEventHandler } from 'react';

import { preventDragAndDropEventsPropagation } from '~/utils';
import type { BackdropStyledProps } from './BackdropStyled';
import { BackdropStyled } from './BackdropStyled';

export const Backdrop = ({ onClick, ...props }: BackdropStyledProps) => {
  const { show } = props;

  useEffect(() => {
    if (show) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;

      // Prevent layout shift on desktop
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }

      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [show]);

  const handleClick: MouseEventHandler<HTMLDivElement> = e => {
    e.stopPropagation();

    onClick?.(e);
  };

  return (
    <BackdropStyled
      aria-hidden="true"
      onClick={handleClick}
      {...preventDragAndDropEventsPropagation()}
      {...props}
    />
  );
};
