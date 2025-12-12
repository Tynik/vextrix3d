import type { Nullable } from '~/types';

export const getCookieValue = (name: string): Nullable<string> => {
  let cookieValue: Nullable<string> = null;

  document.cookie.split('; ').forEach(cookie => {
    const [key, value] = cookie.split('=');
    if (key === name) {
      cookieValue = decodeURIComponent(value);
    }
  });

  return cookieValue;
};
