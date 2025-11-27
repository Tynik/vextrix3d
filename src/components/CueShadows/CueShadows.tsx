import React from 'react';
import { useEffect, useRef } from 'react';
import type { ReactNode, RefAttributes, RefObject } from 'react';
import { invokeIfFunction } from '@react-hive/honey-utils';
import type { HoneyBoxProps } from '@react-hive/honey-layout';
import { HoneyFlexBox, mergeRefs } from '@react-hive/honey-layout';

import type { Nullable } from '~/types';
import { applyCueShadows } from './CueShadowsUtils';

type CueShadowsChildren =
  | ReactNode
  | ((scrollableContentRef: RefObject<Nullable<HTMLDivElement>>) => ReactNode);

export interface CueShadowsProps
  extends RefAttributes<HTMLDivElement>,
    Omit<HoneyBoxProps, 'children' | 'color'> {
  children: CueShadowsChildren;
}

export const CueShadows = ({ ref, children, ...props }: CueShadowsProps) => {
  const contentRef = useRef<Nullable<HTMLDivElement>>(null);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) {
      return;
    }

    const updateCueShadows = () => {
      applyCueShadows(contentElement);
    };

    const observer = new ResizeObserver(updateCueShadows);
    observer.observe(contentElement);

    updateCueShadows();

    contentElement.addEventListener('scroll', updateCueShadows);
    window.addEventListener('resize', updateCueShadows);

    return () => {
      observer.disconnect();

      contentElement.removeEventListener('scroll', updateCueShadows);
      window.removeEventListener('resize', updateCueShadows);
    };
  }, []);

  const mergedRef = mergeRefs(contentRef, ref);

  return (
    <HoneyFlexBox ref={mergedRef} $overflowY="auto" {...props}>
      {invokeIfFunction(children, contentRef)}
    </HoneyFlexBox>
  );
};
