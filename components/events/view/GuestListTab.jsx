import useGetEventInviteesManager from "@/app/events/controllers/getEventInviteesController";
import useTopUpInvitesManager from "@/app/events/controllers/topUpInvitesController";
import CustomButton from "@/components/Button";
import CompletePagination from "@/components/CompletePagination";
import StatusButton from "@/components/StatusButton";
import TablesComponent from "@/components/TablesComponent";
import ModalManagement from "@/components/ModalManagement";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MessageCircle, Mail, MessageSquare, PlusCircle } from "lucide-react";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import StatusButtonWithBool from "@/components/StatusWithBool";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center gap-3">
      <Icon className="w-5 h-5" />
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">{label}:</span>
        <span className="text-lg font-semibold">{value}</span>
      </div>
    </div>
  </div>
);

const GuestListTab = ({ eventId, analytics }) => {
  const route = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [inviteCount, setInviteCount] = useState(50);
  const { data, isLoading } = useGetEventInviteesManager({ eventId });
  const {
    postCaller,
    isLoading: toppingUp,
    isSuccess,
  } = useTopUpInvitesManager();

  useEffect(() => {
    if (isSuccess) {
      document.getElementById("payment_modal").close();
    }
  }, [isSuccess]);

  const handleTopUp = () => {
    postCaller({
      eventId,
      no_of_invitees: inviteCount,
    });
  };

  const stats = [
    {
      icon: PlusCircle,
      label: "Available Slots",
      value: 50,
      iconColor: "text-gray-600",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp Sent",
      value: analytics?.whatsappInvitesSent,
      iconColor: "text-green-600",
    },
    {
      icon: Mail,
      label: "Email Sent",
      value: analytics?.emailInvitesSent,
      iconColor: "text-blue-600",
    },
    {
      icon: MessageSquare,
      label: "SMS Sent",
      value: analytics?.smsInvitesSent,
      iconColor: "text-purple-600",
    },
  ];

  const headers = [
    "Guest name",
    "Phone",
    "Email",
    "Acceptance",
    "Channels",
    "Attendance",
    "Action",
  ];

  const getFormattedValue = (el, index) => [
    index + 1,
    el?.name,
    el?.phone,
    el?.email || "No email",
    <StatusButton status={el?.response} />,
    <div className="flex items-center gap-2">
      <StatusButtonWithBool
        isActive={el?.notification_sent?.whatsapp}
        text="WhatsApp"
      />
      <StatusButtonWithBool isActive={el?.notification_sent?.sms} text="SMS" />
      <StatusButtonWithBool
        isActive={el?.notification_sent?.email}
        text="Email"
      />
    </div>,
  ];

  return (
    <div className="mt-6 flex flex-col w-full gap-4 text-brandBlack">
      <div className="flex items-center gap-4">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
          />
        ))}
        <div className="flex gap-3 ml-auto">
          <CustomButton
            buttonText="Top up Slots"
            icon={<PlusCircle className="w-4 h-4" />}
            onClick={() => document.getElementById("payment_modal").showModal()}
          />
          <CustomButton
            buttonText="Add Guests"
            onClick={() =>
              route.push(
                `/events/create-event/?id=${eventId}&section=Guest List`
              )
            }
          />
        </div>
      </div>

      <div className="h-[67vh] w-full relative">
        <TablesComponent
          isLoading={isLoading}
          data={data?.data}
          getFormattedValue={getFormattedValue}
          headers={headers}
          options={["View Guest", "Edit Guest Info", "Remove Guest"]}
        />
      </div>

      {data?.data.length > 0 && (
        <CompletePagination
          setCurrentPage={setCurrentPage}
          pagination={data?.pagination}
          suffix={"Guests"}
        />
      )}

      <ModalManagement id="payment_modal" title={"Top Up Invite Slots"}>
        <div className="bg-white p-6 rounded-lg w-96 ">
          <div className="w-full">
            <InputWithFullBoarder
              type="number"
              value={inviteCount}
              label={"Enter number of invites to add"}
              isRequired
              onChange={(e) => setInviteCount(parseInt(e.target.value))}
              className="w-full"
              min="1"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => document.getElementById("payment_modal").close()}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleTopUp}
              className="px-4 py-2 bg-brandPurple text-white rounded"
              disabled={toppingUp}
            >
              {toppingUp ? "Processing..." : "Confirm"}
            </button>
          </div>
        </div>
      </ModalManagement>
    </div>
  );
};

export default GuestListTab;
