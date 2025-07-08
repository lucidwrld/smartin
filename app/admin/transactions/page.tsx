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
import TransactionDetailModal from "@/components/transactions/TransactionDetailModal";
import { ConfirmBankPaymentManager } from "@/app/transactions/controllers/confirmBankPaymentController";

const TransactionsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useGetAllTransactionsManager({
    page: currentPage,
  });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { confirmBankPayment, isLoading: confirming } =
    ConfirmBankPaymentManager();
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
      formatDateTime(el?.createdAt),
      <StatusButton status={el?.approved ? "Approved" : "Pending"} />,
    ];
  };
  return (
    <BaseDashboardNavigation title={"Transactions"}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
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
              popUpFunction={(option, inx, val) => {
                if (inx === 0) {
                  setSelectedTransaction(val);
                }
                if (inx === 1) {
                  const details = {
                    paymentId: val?.id,
                    approve: true,
                  };
                  confirmBankPayment(details);
                }
              }}
              options={["View Transaction", "Confirm Payment"]}
              // Close popup function
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
