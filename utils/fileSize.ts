export const convertBytesToMB = (fileSize: number): string => {
  return (fileSize / (1024 * 1024)).toFixed(2);
};
