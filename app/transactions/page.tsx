"use client";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import CompletePagination from "@/components/CompletePagination";
import PaginationRounded from "@/components/Pagination";
import StatusButton from "@/components/StatusButton";
import StatusCard from "@/components/StatusCard";
import TablesComponent from "@/components/TablesComponent";
import UserCard from "@/components/UserCard";
import { ArrowLeftRight, Clock, Wallet, TrendingUp } from "lucide-react";
import React, { useState } from "react";
import useGetAllTransactionsManager from "./controllers/getAllTransactionsController";
import { formatAmount } from "@/utils/formatAmount";
import { formatDateTime } from "@/utils/formatDateTime";
import useGetUserDetailsManager from "../profile-settings/controllers/get_UserDetails_controller";
import TransactionDetailModal from "@/components/transactions/TransactionDetailModal";
import CustomButton from "@/components/Button";
import WithdrawalModal from "@/components/transactions/WithdrawalModal";

const TransactionsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: userDetail } = useGetUserDetailsManager();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { data, isLoading } = useGetAllTransactionsManager({
    page: currentPage,
    user: userDetail?.data?.user?.id,
    enabled: Boolean(userDetail?.data?.user?.id),
  });
  const currency = "NGN";
  const cards = [
    {
      title: "Wallet Balance",
      count: `${currency} ${formatAmount(
        userDetail?.data?.user?.walletBalance || 0
      )}`,
      icon: Wallet,
    },
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
    {
      title: "Total Earnings",
      count: `${currency} ${formatAmount(data?.totals?.totalEarnings || 0)}`,
      icon: TrendingUp,
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

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const walletBalance = userDetail?.data?.user?.walletBalance || 0;

  return (
    <BaseDashboardNavigation title={"Transactions"}>
      {/* Wallet Section */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 mx-4 mb-4 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">Wallet Balance</h2>
            <p className="text-4xl font-bold">
              {currency} {formatAmount(walletBalance)}
            </p>
            <p className="text-purple-200 text-sm mt-1">
              Available for withdrawal
            </p>
          </div>
          <CustomButton
            buttonText="Withdraw Funds"
            buttonColor="bg-white"
            textColor="text-purple-600"
            radius="rounded-md"
            onClick={() => setShowWithdrawModal(true)}
            disabled={walletBalance <= 0}
            prefixIcon={<Wallet className="w-4 h-4" />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {cards.slice(1).map((card, index) => (
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
      <WithdrawalModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        walletBalance={walletBalance}
      />
    </BaseDashboardNavigation>
  );
};

export default TransactionsPage;
