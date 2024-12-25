"use client";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import PaginationRounded from "@/components/Pagination";
import StatusButton from "@/components/StatusButton";
import StatusCard from "@/components/StatusCard";
import TablesComponent from "@/components/TablesComponent";
import UserCard from "@/components/UserCard";
import { ArrowLeftRight, Clock } from "lucide-react";
import React from "react";

const TransactionsPage = () => {
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
      <UserCard letter={"E"} email={"Johndoe@email.com"} name={"John Doe"} />,
      "$200,000",
      <StatusButton status={"Paid"} />,
      "Apr 12, 2023 | 09:32AM",
      <StatusButton status={"Online Payment"} />,
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
              // isLoading={isLoading}
              data={[...Array(30)]}
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
        <div className="flex items-center justify-between mt-4">
          <p className="text-14px text-brandBlack">1-10 of 195 items</p>
          <PaginationRounded
            defaultPage={1}
            count={100}
            onChange={(page) => {
              setCurrentPage(page);
            }}
          />
        </div>
      </div>
    </BaseDashboardNavigation>
  );
};

export default TransactionsPage;
