import React from "react";
import PaginationRounded from "./Pagination";
import { calculatePaginationRange } from "@/utils/calculatePaginationRange";

const CompletePagination = ({ pagination, suffix, setCurrentPage }) => {
  const { startItem, endItem } = calculatePaginationRange(pagination);
  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-14px text-brandBlack">
        {" "}
        {startItem} - {endItem} of {`${pagination?.total} ${suffix}`}
      </p>
      <PaginationRounded
        defaultPage={pagination?.currentPage}
        count={pagination?.pageTotal}
        onChange={(page) => {
          setCurrentPage(page);
        }}
      />
    </div>
  );
};

export default CompletePagination;
