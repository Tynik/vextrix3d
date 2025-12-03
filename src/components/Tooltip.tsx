import React from 'react';
import type { PropsWithChildren } from 'react';

import type { ReferenceType } from '@floating-ui/react';
import { pxToRem, useHoneyStyle } from '@react-hive/honey-style';
import type { HoneyPopupProps } from '@react-hive/honey-layout';
import { HoneyPopup } from '@react-hive/honey-layout';

export type TooltipProps<
  Context,
  Reference extends ReferenceType,
  UseAutoSize extends boolean,
> = HoneyPopupProps<Context, Reference, UseAutoSize>;

export const Tooltip = <
  Context,
  Reference extends ReferenceType,
  UseAutoSize extends boolean = false,
>({
  event = 'hover',
  contentProps,
  arrowProps,
  focusManagerProps,
  roleOptions,
  ...props
}: PropsWithChildren<TooltipProps<Context, Reference, UseAutoSize>>) => {
  const { resolveColor } = useHoneyStyle();

  return (
    <HoneyPopup
      event={event}
      contentProps={{
        $padding: [0.5, 1],
        $borderRadius: '4px',
        $backgroundColor: 'neutral.grayDark',
        $color: 'neutral.white',
        $fontSize: pxToRem(12),
        $boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        $zIndex: 999,
        ...contentProps,
      }}
      useArrow={true}
      arrowProps={{
        fill: resolveColor('neutral.grayDark'),
        ...arrowProps,
      }}
      focusManagerProps={{
        disabled: true,
        ...focusManagerProps,
      }}
      dismissOptions={{
        ancestorScroll: true,
      }}
      roleOptions={{
        role: 'tooltip',
        ...roleOptions,
      }}
      flipOptions={{
        crossAxis: true,
        fallbackPlacements: ['bottom-start', 'bottom-end'],
      }}
      {...props}
    />
  );
};
