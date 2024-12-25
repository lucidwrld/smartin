export const convertBytesToMB = (fileSize) => {
  return (fileSize / (1024 * 1024)).toFixed(2);
};
