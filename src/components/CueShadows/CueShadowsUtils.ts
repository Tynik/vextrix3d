import { convertHexToHexWithAlpha } from '@react-hive/honey-style';

export const applyCueShadows = (element: HTMLElement) => {
  const shadowColor = convertHexToHexWithAlpha('#000000', 0.12);

  const top = element.scrollTop ? 7 : 0;

  const bottom =
    element.clientHeight !== Math.floor(element.scrollHeight - element.scrollTop) ? -7 : 0;

  const left = element.scrollLeft ? 7 : 0;

  const right =
    element.clientWidth !== Math.floor(element.scrollWidth - element.scrollLeft) ? -7 : 0;

  element.style.boxShadow =
    left || top || right || bottom
      ? `
        inset ${left}px ${top}px 7px -7px ${shadowColor},
        inset ${right}px ${bottom}px 7px -7px ${shadowColor}
      `
      : 'none';
};
