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
import useGetAllTransactionsManager from "./controllers/getAllTransactionsController";
import { formatAmount } from "@/utils/formatAmount";
import { formatDateTime } from "@/utils/formatDateTime";
import useGetUserDetailsManager from "../profile-settings/controllers/get_UserDetails_controller";
import TransactionDetailModal from "@/components/transactions/TransactionDetailModal";

const TransactionsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: userDetail } = useGetUserDetailsManager();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { data, isLoading } = useGetAllTransactionsManager({
    page: currentPage,
    user: userDetail?.data?.user?.id,
    enabled: Boolean(userDetail?.data?.user?.id),
  });
  const cards = [
    {
      title: "Total Transactions",
      count: data?.totals?.totalTransactions,
      icon: ArrowLeftRight,
    },
    {
      title: "Pending Confirmation",
      count: data?.totals?.totalPending,
      icon: Clock,
    },
  ];
  const headers = [
    "Name",
    "Amount",
    "Payment Type",
    "Currency",
    "Date",
    "Status",
    "Action",
  ];

  const getFormattedValue = (el, index) => {
    return [
      <UserCard
        letter={el?.user?.fullname.charAt(0)}
        email={el?.user?.email}
        name={el?.user?.fullname}
      />,
      `${el?.currency} ${formatAmount(el?.amount)}`,
      <StatusButton status={el?.payment_type} />,
      <StatusButton status={el?.currency} />,
      formatDateTime(el?.createdAt),
      <StatusButton status={el?.approved ? "Approved" : "Pending"} />,
    ];
  };
  return (
    <BaseDashboardNavigation title={"Transactions"}>
      {/* <div className="grid grid-cols-4 gap-4 p-4">
        {cards.map((card, index) => (
          <StatusCard key={index} {...card} />
        ))}
      </div> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {cards.map((card, index) => (
          <StatusCard key={index} {...card} />
        ))}
      </div>
      <div className="mt-6 flex flex-col w-full gap-4">
        <div className="md:h-[67vh] w-full relative">
          {
            <TablesComponent
              isLoading={isLoading}
              data={data?.data}
              getFormattedValue={getFormattedValue}
              headers={headers}
              showCheckBox={false}
              buttonFunction={(val) => setSelectedTransaction(val)}
            />
          }
        </div>
        {data?.data.length > 0 && (
          <CompletePagination
            setCurrentPage={setCurrentPage}
            pagination={data?.pagination}
            suffix={"Payments"}
          />
        )}
      </div>
      <TransactionDetailModal
        isOpen={Boolean(selectedTransaction)}
        onClose={() => setSelectedTransaction(null)}
        transaction={selectedTransaction}
      />
    </BaseDashboardNavigation>
  );
};

export default TransactionsPage;
