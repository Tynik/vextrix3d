export const getCookieValue = (name: string) => {
  let cookieValue = null;

  document.cookie.split('; ').forEach(cookie => {
    const [key, value] = cookie.split('=');
    if (key === name) {
      cookieValue = decodeURIComponent(value);
    }
  });

  return cookieValue;
};
