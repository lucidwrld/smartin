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
import useGetUsersManager from "./controllers/getAllUsersController";

const UsersPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useGetUsersManager({ page: currentPage });
  const cards = [
    { title: "Total Transactions", count: 120, icon: ArrowLeftRight },
    { title: "Pending Confirmation", count: 120, icon: Clock },
  ];
  const headers = [
    "Name",
    "Amount",
    "Payment Type",
    "Date",
    "Status",
    "Action",
  ];

  const getFormattedValue = (el, index) => {
    return [
      <UserCard
        letter={el?.fullname.charAt(0)}
        email={el?.email}
        name={el?.fullname}
      />,
      `\$${formatAmount(el?.amount)}`,
      <StatusButton status={el?.status} />,
      formatDateTime(el?.createdAt),
      <StatusButton status={el?.narration || "Unknown"} />,
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
              data={data?.data?.transactions}
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
        {data?.data?.transactions.length > 0 && (
          <CompletePagination
            setCurrentPage={setCurrentPage}
            pagination={data?.data?.pagination}
            suffix={"Guests"}
          />
        )}
      </div>
    </BaseDashboardNavigation>
  );
};

export default UsersPage;
