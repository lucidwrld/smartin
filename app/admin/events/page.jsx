"use client";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import CompletePagination from "@/components/CompletePagination";
import PaginationRounded from "@/components/Pagination";
import StatusButton from "@/components/StatusButton";
import StatusCard from "@/components/StatusCard";
import TablesComponent from "@/components/TablesComponent";
import UserCard from "@/components/UserCard";
import { ArrowLeftRight, Clock } from "lucide-react";
import React, { useState } from "react";

import { formatAmount } from "@/utils/formatAmount";
import { formatDateTime } from "@/utils/formatDateTime";
import useGetAllTransactionsManager from "@/app/transactions/controllers/getAllTransactionsController";
import useGetAllEventsManager from "@/app/events/controllers/getAllEventsController";
import { formatDateToLongString } from "@/utils/formatDateToLongString";

const EventsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useGetAllEventsManager({});
  const cards = [
    { title: "Total Events", count: 120, icon: ArrowLeftRight },
    { title: "Inactive Events", count: 120, icon: Clock },
    { title: "Active Events", count: 120, icon: Clock },
    { title: "Upcoming Events", count: 120, icon: Clock },
  ];
  const headers = [
    "Name",
    "Date",
    "Time",
    "Guests",
    "Date",
    "Status",
    "Action",
  ];

  const getFormattedValue = (el, index) => {
    return [
      el?.name,
      formatDateToLongString(el?.date),
      el?.time,
      el?.no_of_invitees,
      <StatusButton status={el?.isActive ? "Active" : "Inactive"} />,
      el?.no_of_invitees,
    ];
  };
  return (
    <BaseDashboardNavigation title={"Transactions"}>
      <div className="grid grid-cols-4 gap-4 p-4">
        {cards.map((card, index) => (
          <StatusCard key={index} {...card} />
        ))}
      </div>
      <div className="mt-6 flex flex-col w-full gap-4">
        <div className="h-[67vh] w-full relative">
          {
            <TablesComponent
              isLoading={isLoading}
              data={data?.data}
              getFormattedValue={getFormattedValue}
              headers={headers}
              buttonFunction={() => {}}
              options={[
                "View Transaction",
                "Confirm Payment",
                "Suspend Transaction",
              ]}
              // Close popup function
            />
          }
        </div>
        {data?.data?.length > 0 && (
          <CompletePagination
            setCurrentPage={setCurrentPage}
            pagination={data?.pagination}
            suffix={"Guests"}
          />
        )}
      </div>
    </BaseDashboardNavigation>
  );
};

export default EventsPage;
