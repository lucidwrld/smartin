const { useSearchParams } = require("next/navigation");

export const getQueryParams = (keys) => {
  const searchParams = useSearchParams();
  return keys.reduce((acc, key) => {
    acc[key] = searchParams.get(key);
    return acc;
  }, {});
};
