import type { SyntheticEvent } from 'react';
import { isString } from '@react-hive/honey-utils';

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

export const downloadFile = (
  fileObj: Blob | MediaSource | string,
  fileName = '',
  target = '',
): void => {
  const link = document.createElement('a');

  const url = isString(fileObj) ? fileObj : URL.createObjectURL(fileObj);
  link.href = url;

  if (target) {
    link.target = target;
  }

  if (fileName) {
    link.download = fileName;
  }

  link.click();
  link.remove();

  if (!isString(fileObj)) {
    URL.revokeObjectURL(url);
  }
};
