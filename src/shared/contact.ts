export const formatPhone = (value: string | undefined) => {
  if (!value) {
    return value;
  }

  // Expect 11 digits starting with 07
  if (!/^07\d{9}$/.test(value)) {
    return value;
  }

  return `${value.slice(0, 5)} ${value.slice(5)}`;
};
