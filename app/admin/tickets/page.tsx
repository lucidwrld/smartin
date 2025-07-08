"use client";

import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import SearchComponent from "@/components/SearchComponent";

import TicketsTable from "@/components/support/TicketsTable";

import { Download } from "lucide-react";

import React, { useState } from "react";
import useGetAllTicketsManager from "./controllers/getAllTicketsController";
import useDebounce from "@/utils/UseDebounce";
import { calculatePaginationRange } from "@/utils/calculatePaginationRange";
import PaginationRounded from "@/components/Pagination";
import TabManager from "@/components/TabManager";

const AdminTicketsPage = () => {
  const [currentView, setCurrentView] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(`&title=${searchValue}`, 1000);
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useGetAllTicketsManager({
    page: currentPage,
    searchQuery: debouncedSearchValue,
    enabled: true,
  });

  const { startItem, endItem } = calculatePaginationRange(data?.pagination);

  return (
    <BaseDashboardNavigation title={`Support Tickets`}>
      <p className="w-full text-22px font-medium text-brandBlack">
        {data?.pagination?.total} Tickets
      </p>
      <div className="w-full relative">
        <div className="items-center justify-between w-full flex">
          <div className="w-fit">
            <TabManager
              currentView={currentView}
              setCurrentView={setCurrentView}
              list={["Open Tickets", "Closed Tickets"]}
            />
          </div>
          <div className="flex items-center justify-end gap-4 my-3">
            <div className="flex items-center gap-3">
              <SearchComponent value="" onChange={() => {}} placeholder="Search tickets..." />
              <Download className="w-6 h-6 mt-1.5 text-gray-600" />
            </div>
          </div>
        </div>
        <div className="h-[67vh] w-full relative">
          <TicketsTable data={data?.tickets} isLoading={isLoading} />
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-14px text-brandBlack">
            {" "}
            {startItem} - {endItem} of {data?.pagination?.total} tickets
          </p>

          <PaginationRounded
            count={data?.pagination?.pageTotal}
            defaultPage={data?.pagination?.currentPage}
            onChange={(page) => {
              setCurrentPage(page);
            }}
          />
        </div>
      </div>
    </BaseDashboardNavigation>
  );
};

export default AdminTicketsPage;
