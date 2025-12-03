export const getReadableFileSize = (sizeInBytes: number) => {
  if (!sizeInBytes) {
    return '';
  }

  const kb = 1024 * 1024;

  if (sizeInBytes < 1024) {
    return `${sizeInBytes} Bytes`;
  }
  if (sizeInBytes < kb) {
    return `${(sizeInBytes / 1024).toFixed(1)}KB`;
  }
  return `${(sizeInBytes / kb).toFixed(1)}MB`;
};
