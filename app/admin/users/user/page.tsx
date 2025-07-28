"use client";
import React, { useState } from "react";
import BaseDashboardNavigation from "@/components/BaseDashboardNavigation";
import TablesComponent from "@/components/TablesComponent";
import StatusButton from "@/components/StatusButton";
import { UserCircle, ArrowLeft } from "lucide-react";
import { formatDateTime } from "@/utils/formatDateTime";
import { formatAmount } from "@/utils/formatAmount";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import Dropdown from "@/components/Dropdown";
import { Plus, CreditCard } from "lucide-react";

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
import { ConfirmBankPaymentManager } from "@/app/transactions/controllers/confirmBankPaymentController";
import { SuspendUnsuspendUserManager } from "../controllers/suspendUnsuspendUserController";
import { AddUserCreditsManager } from "@/app/events/controllers/creditManagement/addUserCreditsController";

const UserDetailsPage = () => {
  const { id } = getQueryParams(["id"]);
  const router = useRouter();
  const [currentView, setCurrentView] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { data: user, isLoading } = useGetSingleUser({
    userId: id,
    enabled: Boolean(id),
  });
  const { makePartner } = MakeUserPartnerManager({ userId: id });
  const { manageSuspend } = SuspendUnsuspendUserManager({
    userId: id,
  });
  const { confirmBankPayment } = ConfirmBankPaymentManager();
  const { addUserCredits, isLoading: addingCredits } = AddUserCreditsManager();

  // Credit management states
  const [creditForm, setCreditForm] = useState({
    type: 'invitation',
    channel: 'email',
    quantity: ''
  });
  const [creditItems, setCreditItems] = useState([]);
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

  // Credit management functions
  const handleAddCreditItem = () => {
    if (!creditForm.quantity || creditForm.quantity <= 0) return;
    
    const newItem = {
      id: Date.now(),
      type: creditForm.type,
      channel: creditForm.channel,
      quantity: parseInt(creditForm.quantity)
    };
    
    setCreditItems([...creditItems, newItem]);
    setCreditForm({ ...creditForm, quantity: '' });
  };

  const handleRemoveCreditItem = (id) => {
    setCreditItems(creditItems.filter(item => item.id !== id));
  };

  const handleSubmitCredits = async () => {
    if (creditItems.length === 0) return;
    
    const payload = {
      userId: id,
      purchaseItems: creditItems.map(item => ({
        type: item.type,
        channel: item.channel,
        quantity: item.quantity
      }))
    };
    
    await addUserCredits(payload);
    setCreditItems([]);
  };

  const channelOptions = [
    { value: 'email', label: 'Email' },
    { value: 'sms', label: 'SMS' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'voice', label: 'Voice Call' }
  ];

  const typeOptions = [
    { value: 'invitation', label: 'Invitation' },
    { value: 'notification', label: 'Notification' }
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
        list={["Details", "Payments", "Events", "Credits"]}
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
            buttonFunction={() => {}}
            toggleRowFunction={() => {}}
            toggleSelectAllFunction={() => {}}
            setSelectedRows={() => {}}
            selectedRows={[]}
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
            buttonFunction={() => {}}
            toggleRowFunction={() => {}}
            toggleSelectAllFunction={() => {}}
            setSelectedRows={() => {}}
            selectedRows={[]}
            popUpFunction={(option, inx, val) => {
              if (inx === 0) {
                router.push(`/admin/events/event?id=${val?.id}`);
              }
            }}
            getFormattedValue={getEventValue}
            headers={eventHeaders}
          />
        )}

        {currentView === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add Credits for User</h3>
            </div>

            {/* Add Credit Form */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-medium mb-4">Add New Credit Item</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <Dropdown
                    label="Credit Type"
                    id="credit_type"
                    type="select"
                    value={creditForm.type}
                    options={typeOptions}
                    onChange={(e) => setCreditForm({ ...creditForm, type: e.target.value })}
                  />
                </div>
                <div>
                  <Dropdown
                    label="Channel"
                    id="credit_channel"
                    type="select"
                    value={creditForm.channel}
                    options={channelOptions}
                    onChange={(e) => setCreditForm({ ...creditForm, channel: e.target.value })}
                  />
                </div>
                <div>
                  <InputWithFullBoarder
                    label="Quantity"
                    type="number"
                    value={creditForm.quantity}
                    onChange={(e) => setCreditForm({ ...creditForm, quantity: e.target.value })}
                    placeholder="Enter quantity"
                    min="1"
                  />
                </div>
                <div>
                  <CustomButton
                    buttonText="Add Item"
                    buttonColor="bg-blue-600"
                    textColor="text-white"
                    onClick={handleAddCreditItem}
                    prefixIcon={<Plus size={16} />}
                    disabled={!creditForm.quantity || creditForm.quantity <= 0}
                  />
                </div>
              </div>
            </div>

            {/* Credit Items List */}
            {creditItems.length > 0 && (
              <div className="bg-white border rounded-lg">
                <div className="p-4 border-b">
                  <h4 className="font-medium">Credits to Add</h4>
                </div>
                <div className="divide-y">
                  {creditItems.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <CreditCard size={20} className="text-gray-400" />
                        <div>
                          <p className="font-medium capitalize">
                            {item.type} - {item.channel}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} credits
                          </p>
                        </div>
                      </div>
                      <CustomButton
                        buttonText="Remove"
                        buttonColor="bg-red-50"
                        textColor="text-red-600"
                        onClick={() => handleRemoveCreditItem(item.id)}
                      />
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t bg-gray-50">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">
                      Total Items: {creditItems.length}
                    </p>
                    <CustomButton
                      buttonText={addingCredits ? "Adding Credits..." : "Add All Credits"}
                      buttonColor="bg-green-600"
                      textColor="text-white"
                      onClick={handleSubmitCredits}
                      isLoading={addingCredits}
                      disabled={addingCredits || creditItems.length === 0}
                    />
                  </div>
                </div>
              </div>
            )}

            {creditItems.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CreditCard size={48} className="mx-auto mb-4 text-gray-300" />
                <p>No credit items added yet</p>
                <p className="text-sm">Use the form above to add credits for this user</p>
              </div>
            )}
          </div>
        )}
      </div>
    </BaseDashboardNavigation>
  );
};

export default UserDetailsPage;
