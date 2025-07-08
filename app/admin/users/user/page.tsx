"use client";
import React, { useState } from "react";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import TablesComponent from "@/components/TablesComponent";
import StatusButton from "@/components/StatusButton";
import { UserCircle, ArrowLeft } from "lucide-react";
import { formatDateTime } from "@/utils/formatDateTime";
import { formatAmount } from "@/utils/formatAmount";
import CustomButton from "@/components/Button";

import { useRouter } from "next/navigation";
import { getQueryParams } from "@/utils/getQueryParams";
import useGetSingleUser from "../controllers/getSingleUserController";
import TabManager from "@/components/TabManager";
import useGetAllTransactionsManager from "@/app/transactions/controllers/getAllTransactionsController";
import UserCard from "@/components/UserCard";
import { formatDateToLongString } from "@/utils/formatDateToLongString";
import useGetAllEventsManager from "@/app/events/controllers/getAllEventsController";
import { formatDate } from "@/utils/formatDate";
import { MakeUserPartnerManager } from "../controllers/makeUserPartnerController";
import { SuspendUnsuspendUserManager } from "../controllers/suspendUnsuspendUserController";

const UserDetailsPage = () => {
  const { id } = getQueryParams(["id"]);
  const router = useRouter();
  const [currentView, setCurrentView] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: user, isLoading } = useGetSingleUser({
    userId: id,
    enabled: Boolean(id),
  });
  const { makePartner } = MakeUserPartnerManager({ userId: id });
  const { manageSuspend } = SuspendUnsuspendUserManager({
    userId: id,
  });
  const { data, isLoading: loadingTransactions } = useGetAllTransactionsManager(
    {
      enabled: Boolean(id),
      user: id,
      page: currentPage,
    }
  );

  const { data: events, isLoading: loadingEvents } = useGetAllEventsManager({
    enabled: Boolean(id),
    user: id,
    page: currentPage,
    status: null,
    date: null,
  });

  // Mock data for payments and events tables
  const paymentHeaders = [
    "Name",
    "Amount",
    "Payment Type",
    "Date",
    "Status",
    "Action",
  ];
  const eventHeaders = [
    "Event",
    "User",
    "Date",
    "Time",
    "Guests",
    "Creation Date",
    "Status",
    "Action",
  ];

  const getPaymentValue = (el) => [
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

  const getEventValue = (el) => [
    el?.name,
    el?.user?.fullname,
    formatDateToLongString(el?.date),
    el?.time,
    el?.no_of_invitees,
    formatDate(el?.createdAt),
    <StatusButton status={el?.isActive ? "Active" : "Inactive"} />,
  ];

  if (isLoading) return <div>Loading...</div>;

  return (
    <BaseDashboardNavigation title="User Details">
      <div className="flex items-center gap-4 mb-6 text-brandBlack">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => router.push("/admin/users")}
        />
        <h1 className="text-2xl font-semibold">User Details</h1>
      </div>

      {/* User Header Section */}
      <div className="bg-white rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <UserCircle size={40} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-brandBlack">
                {user?.data?.user?.fullname}
              </h2>
              <p className="text-gray-600">{user?.data?.user?.email}</p>
              <p className="text-gray-600">{user?.data?.user?.phone}</p>
            </div>
          </div>
          <div className="flex gap-3">
            {user?.data?.user?.isPartner ? (
              <CustomButton
                buttonText="Remove Partner Status"
                buttonColor="bg-red-50"
                textColor="text-red-600"
                onClick={() => {
                  makePartner();
                }}
              />
            ) : (
              <CustomButton
                buttonText="Make Partner"
                buttonColor="bg-green-50"
                textColor="text-green-600"
                onClick={() => {
                  /* Handle make partner */
                  makePartner();
                }}
              />
            )}
            <CustomButton
              buttonText={
                user?.data?.user?.isSuspended
                  ? "Unsuspend User"
                  : "Suspend User"
              }
              buttonColor={
                user?.data?.user?.isSuspended ? "bg-green-50" : "bg-red-50"
              }
              textColor={
                user?.data?.user?.isSuspended
                  ? "text-green-600"
                  : "text-red-600"
              }
              onClick={() => {
                /* Handle suspension */
                manageSuspend();
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Member Since</p>
            <p className="text-lg font-medium">
              {formatDateTime(user?.data?.user?.createdAt)}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Status</p>
            <StatusButton
              status={
                user?.data?.user?.isSuspended
                  ? "Suspended"
                  : user?.data?.user?.is_active
                  ? "Active"
                  : "Inactive"
              }
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">User Type</p>
            <p className="text-lg font-medium capitalize">
              {user?.data?.isPartner ? "Partner" : "Regular User"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <TabManager
        currentView={currentView}
        setCurrentView={setCurrentView}
        list={["Details", "Payments", "Events"]}
      />

      {/* Tab Content */}
      <div className="bg-white rounded-lg p-6">
        {currentView === 0 && (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Personal Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600">Full Name</p>
                  <p className="font-medium">{user?.data?.user?.fullname}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{user?.data?.user?.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-medium">{user?.data?.user?.phone}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Account Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600">Account Status</p>
                  <StatusButton
                    status={
                      user?.data?.user?.isSuspended
                        ? "Suspended"
                        : user?.data?.user?.is_active
                        ? "Active"
                        : "Inactive"
                    }
                  />
                </div>
                <div>
                  <p className="text-gray-600">Member Since</p>
                  <p className="font-medium">
                    {formatDateTime(user?.data?.user?.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Last Updated</p>
                  <p className="font-medium">
                    {formatDateTime(user?.data?.user?.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 1 && (
          <TablesComponent
            isLoading={isLoading}
            data={data?.data}
            getFormattedValue={getPaymentValue}
            headers={paymentHeaders}
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
        )}

        {currentView === 2 && (
          <TablesComponent
            isLoading={loadingEvents}
            data={events?.data}
            options={["View Event", "Suspend Event"]}
            popUpFunction={(option, inx, val) => {
              if (inx === 0) {
                router.push(`/admin/events/event?id=${val?.id}`);
              }
            }}
            getFormattedValue={getEventValue}
            headers={eventHeaders}
          />
        )}
      </div>
    </BaseDashboardNavigation>
  );
};

export default UserDetailsPage;
