"use client";
import AdminPageTop from "@/components/AdminPageTop";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import SearchComponent from "@/components/SearchComponent";
import PaginationRounded from "@/components/pagination";
import TicketsTable from "@/components/support/TicketsTable";
import UsersTable from "@/components/users/UsersTable";
import { exportSVG, filter, searchComponent } from "@/public/icons";

import React, { useState } from "react";
import useGetAllTicketsManager from "./controllers/getAllTicketsController";
import useDebounce from "@/utils/UseDebounce";
import { calculatePaginationRange } from "@/utils/calculatePaginationRange";

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
          <div className="flex items-center w-fit justify-start relative gap-0 mt-5">
            {["Open Tickets", "Closed Tickets"].map((el, i) => (
              <p
                key={i}
                role="button"
                onClick={() => setCurrentView(i)}
                className={`text-13px pb-2 px-10 ${
                  currentView === i
                    ? "font-medium text-brandBlack border border-transparent border-b-2 border-b-brandBlack"
                    : "text-textGrey2"
                }`}
              >
                {el}
              </p>
            ))}
            <div className="divider divider-[#E4E7EC] inset-y-0 absolute top-1.5 w-[350px]"></div>
          </div>
          <div className="flex items-center justify-end gap-4 my-3">
            <div className="flex items-center gap-3">
              <SearchComponent />
              {<img src={exportSVG.src} alt="" className="mt-1.5" />}
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
