import type { SyntheticEvent } from 'react';

export const preventDragAndDropEventsPropagation = () => {
  const handleEventPropagation = (e: SyntheticEvent) => {
    e.stopPropagation();
  };

  return {
    onDragStart: handleEventPropagation,
    onDrag: handleEventPropagation,
    onDragEnd: handleEventPropagation,
    onDragOver: handleEventPropagation,
    onDragEnter: handleEventPropagation,
    onDragLeave: handleEventPropagation,
    onDrop: handleEventPropagation,
    onTouchStart: handleEventPropagation,
    onTouchMove: handleEventPropagation,
    onTouchEnd: handleEventPropagation,
  };
};

export const scrollIntoView = (element: HTMLElement, offset = 0) => {
  const top = element.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top,
    behavior: 'smooth',
  });
};
