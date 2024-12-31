// GuestListTab.js
import useGetEventInviteesManager from "@/app/events/controllers/getEventInviteesController";
import useTopUpInvitesManager from "@/app/events/controllers/topUpInvitesController";
import CustomButton from "@/components/Button";
import CompletePagination from "@/components/CompletePagination";
import StatusButton from "@/components/StatusButton";
import TablesComponent from "@/components/TablesComponent";
import ModalManagement from "@/components/ModalManagement";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  MessageCircle,
  Mail,
  MessageSquare,
  PlusCircle,
  Send,
  PlusIcon,
} from "lucide-react";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import StatusButtonWithBool from "@/components/StatusWithBool";
import { shouldChargeInNaira } from "@/utils/shouldChargeInNaira";
import { RemoveInvitedGuests } from "@/app/events/controllers/removeInvitedGuest";
import { GuestEditModal, GuestViewModal } from "../GuestViewAndEditComponent";

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

const GuestListTab = ({ eventId, analytics, event }) => {
  const route = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [inviteCount, setInviteCount] = useState(50);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedGuestIds, setSelectedGuestIds] = useState([]);
  const [modalToOpen, setModalToOpen] = useState(null);

  const { data, isLoading } = useGetEventInviteesManager({
    eventId,
    page: currentPage,
  });

  const { removeGuests, isLoading: removing } = RemoveInvitedGuests({
    eventId: eventId,
  });

  const {
    postCaller,
    isLoading: toppingUp,
    isSuccess,
  } = useTopUpInvitesManager();

  const [selectedGuest, setSelectedGuest] = useState(null);
  // Effect to handle modal opening after selectedGuest is set
  useEffect(() => {
    if (selectedGuest && modalToOpen) {
      const modal = document.getElementById(modalToOpen);
      if (modal) {
        modal.showModal();
      }
      setModalToOpen(null); // Reset modal flag after opening
    }
  }, [selectedGuest, modalToOpen]);
  useEffect(() => {
    if (isSuccess) {
      document.getElementById("payment_modal").close();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (selectedGuestIds.length > 0) {
      console.log("Selected Guest IDs:", selectedGuestIds);
    }
  }, [selectedGuestIds]);

  const handleTopUp = async () => {
    const isNairaCharge = await shouldChargeInNaira();
    const currency = isNairaCharge ? "NGN" : "USD";
    postCaller({
      eventId,
      no_of_invitees: inviteCount,
      currency: currency,
      path: `/events/event/?id=${eventId}`,
    });
  };

  const stats = [
    {
      icon: PlusCircle,
      label: "Available Slots",
      value: event?.slots_left,
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
    "Attendance",
    "Acceptance",
    "Invite Channels",
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

  const handleRowSelection = (index, guest) => {
    // Update selectedRows for UI
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }

    // Update selectedGuestIds for operations
    if (guest?.id) {
      setSelectedGuestIds((prev) =>
        prev.includes(guest.id)
          ? prev.filter((id) => id !== guest.id)
          : [...prev, guest.id]
      );
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      // Select all rows in current page
      setSelectedRows(data?.data.map((_, index) => index));
      // Get all IDs from current page
      const currentPageIds = data?.data
        .filter((guest) => guest?.id)
        .map((guest) => guest.id);
      setSelectedGuestIds(currentPageIds);
    } else {
      setSelectedRows([]);
      setSelectedGuestIds([]);
    }
  };
  const handleGuestAction = (option, _, guest) => {
    setSelectedGuest(guest);

    if (option === "View Guest") {
      setModalToOpen("view_guest_modal");
    } else if (option === "Edit Guest Info") {
      setModalToOpen("edit_guest_modal");
    } else if (option === "Remove Guest") {
      removeGuests({ guestIds: [guest.id] });
    }
  };
  const renderActionButtons = () => {
    if (selectedGuestIds.length > 0) {
      return (
        <div className="flex gap-3 ml-auto">
          <CustomButton
            buttonText={`Remove Selected (${selectedGuestIds.length})`}
            onClick={() => {
              removeGuests({ guestIds: selectedGuestIds });
              setSelectedGuestIds([]);
              setSelectedRows([]);
            }}
            isLoading={removing}
            radius={"rounded-full"}
          />
          <CustomButton
            buttonText="Invite Selected"
            prefixIcon={<Send className="w-4 h-4" />}
            radius={"rounded-full"}
          />
          <CustomButton buttonText="Send Reminders" radius={"rounded-full"} />
          <CustomButton buttonText="Send Updates" radius={"rounded-full"} />
        </div>
      );
    }

    return (
      <div className="flex gap-3 ml-auto">
        <CustomButton
          buttonText="Send All Guests"
          prefixIcon={<Send className="w-4 h-4" />}
          radius={"rounded-full"}
        />
        <CustomButton
          buttonText="Top up Slots"
          prefixIcon={<PlusCircle className="w-4 h-4" />}
          onClick={() => document.getElementById("payment_modal").showModal()}
          radius={"rounded-full"}
        />
        <CustomButton
          buttonText="Add Guests"
          prefixIcon={<PlusIcon className="w-4 h-4" />}
          radius={"rounded-full"}
          onClick={() =>
            route.push(`/events/create-event/?id=${eventId}&section=Guest List`)
          }
        />
      </div>
    );
  };

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
        {renderActionButtons()}
      </div>
      <div className="h-[67vh] w-full relative">
        <TablesComponent
          isLoading={isLoading}
          data={data?.data}
          getFormattedValue={getFormattedValue}
          toggleSelectAllFunction={handleSelectAll}
          toggleRowFunction={handleRowSelection}
          setSelectedRows={setSelectedRows}
          selectedRows={selectedRows}
          headers={headers}
          popUpFunction={(option, inx, selected) =>
            handleGuestAction(option, inx, selected)
          }
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
        <div className="bg-white p-6 rounded-lg w-96">
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
      // Add after the payment modal
      <GuestViewModal
        guest={selectedGuest}
        onEdit={() => {
          document.getElementById("view_guest_modal").close();
          setModalToOpen("edit_guest_modal");
        }}
        onDelete={() => {
          document.getElementById("view_guest_modal").close();
          if (selectedGuest?.id) {
            removeGuests({ guestIds: [selectedGuest.id] });
          }
        }}
      />
      <GuestEditModal
        guest={selectedGuest}
        onSave={async (formData) => {
          try {
            // await updateGuest(selectedGuest.id, formData);
            document.getElementById("edit_guest_modal").close();
          } catch (error) {
            console.error("Failed to update guest:", error);
          }
        }}
        isLoading={false}
      />
    </div>
  );
};

export default GuestListTab;
