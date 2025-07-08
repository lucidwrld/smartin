export const calculatePaginationRange = (pagination) => {
  const currentPage = pagination?.currentPage || 0;
  const pageSize = pagination?.pageSize || 0;
  const totalItems = pagination?.total || 0;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return { startItem, endItem };
};
