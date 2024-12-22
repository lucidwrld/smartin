export const capitalizeFirstLetter = (word) => {
  if (!word) return ""; // Handle empty or null input
  return word.charAt(0).toUpperCase() + word.slice(1);
};
