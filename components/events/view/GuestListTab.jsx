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
  Calendar,
  Clock,
} from "lucide-react";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import StatusButtonWithBool from "@/components/StatusWithBool";
import { shouldChargeInNaira } from "@/utils/shouldChargeInNaira";
import { RemoveInvitedGuests } from "@/app/events/controllers/removeInvitedGuest";
import { GuestEditModal, GuestViewModal } from "../GuestViewAndEditComponent";
import useGetUserDetailsManager from "@/app/profile-settings/controllers/get_UserDetails_controller";
import { SendNotificationManager } from "@/app/notifications/controllers/sendNotificationController";
import { MarkAttendanceManager } from "@/app/events/controllers/markAttendanceController";
import GuestListStep from "@/components/events/GuestListStep";
import { ArrowLeft } from "lucide-react";
import { AddInviteesManager } from "@/app/events/controllers/addInviteesController";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-white rounded-lg shadow p-3 md:p-4 w-full md:w-auto">
    <div className="flex items-center gap-2 md:gap-3">
      <Icon className="w-4 h-4 md:w-5 md:h-5" />
      <div className="flex flex-col md:flex-row md:items-center md:gap-2">
        <span className="text-xs md:text-sm text-gray-500">{label}:</span>
        <span className="text-sm md:text-lg font-semibold">{value}</span>
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
  const [selectedSession, setSelectedSession] = useState("all");
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [guestFormData, setGuestFormData] = useState({ 
    guestList: [{ name: "", email: "", phone: "" }] 
  });

  const handleGuestFormDataChange = (field, value) => {
    setGuestFormData(prev => ({ ...prev, [field]: value }));
  };

  const { addInvitees, isLoading: addingGuests, isSuccess: guestsAdded } = AddInviteesManager();

  // Handle successful guest addition
  useEffect(() => {
    if (guestsAdded) {
      // Reset form and go back to guest list
      setGuestFormData({ guestList: [{ name: "", email: "", phone: "" }] });
      setShowAddGuest(false);
    }
  }, [guestsAdded]);

  const handleSubmitGuests = async () => {
    try {
      // Filter out empty guests and format the payload
      const validGuests = guestFormData.guestList.filter(guest => 
        guest.name && guest.name.trim() !== ""
      );

      if (validGuests.length === 0) {
        alert("Please add at least one guest with a name");
        return;
      }

      const payload = {
        eventId: eventId,
        invitees: validGuests.map(guest => ({
          name: guest.name,
          phone: guest.phone || "",
          email: guest.email || ""
        }))
      };

      await addInvitees(payload);
    } catch (error) {
      console.error("Error adding guests:", error);
    }
  };
  const [sessionForAttendance, setSessionForAttendance] = useState(null);
  const [guestForAttendance, setGuestForAttendance] = useState(null);
  const { data: userDetails } = useGetUserDetailsManager();
  const currency = userDetails?.data?.user?.currency || "USD";
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
      setModalToOpen(null);
      // Reset modal flag after opening
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
    postCaller({
      eventId,
      no_of_invitees: inviteCount,
      currency: currency,
      path: `/events/${eventId}`,
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

  const { sendNotification, isLoading: sending } = SendNotificationManager({
    eventId: eventId,
  });

  const headers = [
    "Guest name",
    "Phone",
    "Email",
    "Acceptance",
    "Attendance",
    "Invite Channels",
    "Action",
  ];

  const getFormattedValue = (el, index) => [
    el?.name,
    el?.phone,
    el?.email || "No email",
    <StatusButton status={el?.response} />,
    event?.enable_sessions && el?.session_attendance ? (
      <div className="text-xs">
        <span className="font-medium">
          {el.session_attendance.length}/{event.sessions?.length || 0} sessions
        </span>
      </div>
    ) : (
      <StatusButton status={el?.attended ? "Attended" : "Not Attended"} />
    ),
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

  const { markAttendance, isLoading: markingAttendance } = MarkAttendanceManager();
  
  const handleGuestAction = (option, _, guest) => {
    setSelectedGuest(guest);

    if (option === "View Guest") {
      setModalToOpen("view_guest_modal");
    } else if (option === "Edit Guest Info") {
      setModalToOpen("edit_guest_modal");
    } else if (option === "Confirm Attendance") {
      // Check if event has sessions enabled
      if (event?.enable_sessions && event?.sessions?.length > 0) {
        setGuestForAttendance(guest);
        setShowSessionModal(true);
      } else {
        // No sessions, mark general attendance
        markAttendance({ inviteeId: guest?.id });
      }
    } else if (option === "Remove Guest") {
      removeGuests({ inviteIds: [guest.id] });
    }
  };

  const handleMarkSessionAttendance = async () => {
    if (!guestForAttendance) return;
    
    const attendanceData = {
      inviteeId: guestForAttendance.id,
    };
    
    // Add session ID if specific session selected
    if (sessionForAttendance && sessionForAttendance !== "all") {
      attendanceData.sessionId = sessionForAttendance;
    }
    
    await markAttendance(attendanceData);
    setShowSessionModal(false);
    setGuestForAttendance(null);
    setSessionForAttendance(null);
  };
  const renderActionButtons = () => {
    if (selectedGuestIds.length > 0) {
      return (
        <div className="flex flex-col md:flex-row gap-2 md:gap-3 w-full md:w-auto md:ml-auto">
          <CustomButton
            buttonText={`Remove (${selectedGuestIds.length})`}
            onClick={() => {
              removeGuests({ inviteIds: selectedGuestIds });
              setSelectedGuestIds([]);
              setSelectedRows([]);
            }}
            isLoading={removing}
            radius="rounded-full"
            className="text-xs md:text-sm w-full md:w-auto"
          />
          <CustomButton
            buttonText="Invite"
            prefixIcon={<Send className="w-3 h-3 md:w-4 md:h-4" />}
            radius="rounded-full"
            isLoading={sending}
            onClick={() => {
              const details = {
                inviteeIds: selectedGuestIds,
                type: "event",
              };
              sendNotification(details);
            }}
            className="text-xs md:text-sm w-full md:w-auto"
          />
          <div className="flex gap-2 md:gap-3">
            <CustomButton
              buttonText="Send Reminders"
              radius="rounded-full"
              isLoading={sending}
              onClick={() => {
                const details = {
                  inviteeIds: selectedGuestIds,
                  type: "reminder",
                };
                sendNotification(details);
              }}
              className="text-xs md:text-sm w-full md:w-auto"
            />
            <CustomButton
              buttonText="Send Updates"
              radius="rounded-full"
              isLoading={sending}
              onClick={() => {
                const details = {
                  inviteeIds: selectedGuestIds,
                  type: "update",
                };
                sendNotification(details);
              }}
              className="text-xs md:text-sm w-full md:w-auto"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col md:flex-row gap-2 md:gap-3 w-full md:w-auto md:ml-auto">
        <CustomButton
          buttonText="Invite All"
          prefixIcon={<Send className="w-3 h-3 md:w-4 md:h-4" />}
          onClick={() => {
            sendNotification({
              inviteeIds: [],
              type: "event",
            });
          }}
          isLoading={sending}
          radius="rounded-full"
          className="text-xs md:text-sm w-full md:w-auto"
        />
        <CustomButton
          buttonText="Top up"
          prefixIcon={<PlusCircle className="w-3 h-3 md:w-4 md:h-4" />}
          onClick={() => document.getElementById("payment_modal").showModal()}
          radius="rounded-full"
          className="text-xs md:text-sm w-full md:w-auto"
        />
        <CustomButton
          buttonText="Add Guests"
          prefixIcon={<PlusIcon className="w-3 h-3 md:w-4 md:h-4" />}
          radius="rounded-full"
          className="text-xs md:text-sm w-full md:w-auto"
          onClick={() => setShowAddGuest(true)}
        />
      </div>
    );
  };

  // Show Add Guest component if showAddGuest is true
  if (showAddGuest) {
    return (
      <div className="mt-4 md:mt-6 flex flex-col w-full gap-3 md:gap-4 text-brandBlack p-2 md:p-0">
        <div className="mb-6">
          <CustomButton
            buttonText="Back to Guest List"
            prefixIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => setShowAddGuest(false)}
            buttonColor="bg-gray-600"
            radius="rounded-full"
            className="text-sm"
          />
        </div>
        <GuestListStep 
          formData={guestFormData}
          onFormDataChange={handleGuestFormDataChange}
        />
        
        {/* Submit Button */}
        <div className="mt-6 flex gap-3">
          <CustomButton
            buttonText="Add Guests"
            onClick={handleSubmitGuests}
            isLoading={addingGuests}
            buttonColor="bg-purple-600"
            radius="rounded-full"
            className="text-sm"
          />
          <CustomButton
            buttonText="Cancel"
            onClick={() => setShowAddGuest(false)}
            buttonColor="bg-gray-300"
            textColor="text-gray-700"
            radius="rounded-full"
            className="text-sm"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 md:mt-6 flex flex-col w-full gap-3 md:gap-4 text-brandBlack p-2 md:p-0">
      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
        <div className="grid grid-cols-2 md:flex md:flex-row gap-2 md:gap-4">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
            />
          ))}
        </div>
        {renderActionButtons()}
      </div>

      <div className="h-[50vh] md:h-[67vh] w-full relative overflow-x-auto">
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
          options={[
            "View Guest",
            "Edit Guest Info",
            "Confirm Attendance",
            "Remove Guest",
          ]}
          className="min-w-[800px]"
        />
      </div>

      {data?.data.length > 0 && (
        <div className="mt-2 md:mt-0">
          <CompletePagination
            setCurrentPage={setCurrentPage}
            pagination={data?.pagination}
            suffix="Guests"
          />
        </div>
      )}

      <ModalManagement id="payment_modal" title="Top Up Invite Slots">
        <div className="bg-white p-4 md:p-6 rounded-lg w-full md:w-96 mx-4 md:mx-0">
          <div className="w-full">
            <InputWithFullBoarder
              type="number"
              value={inviteCount}
              label="Enter number of invites to add"
              isRequired
              onChange={(e) => setInviteCount(parseInt(e.target.value))}
              className="w-full"
              min="1"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => document.getElementById("payment_modal").close()}
              className="px-3 md:px-4 py-2 border rounded text-sm md:text-base"
            >
              Cancel
            </button>
            <button
              onClick={handleTopUp}
              className="px-3 md:px-4 py-2 bg-brandPurple text-white rounded text-sm md:text-base"
              disabled={toppingUp}
            >
              {toppingUp ? "Processing..." : "Confirm"}
            </button>
          </div>
        </div>
      </ModalManagement>

      <GuestViewModal
        guest={selectedGuest}
        onEdit={() => {
          document.getElementById("view_guest_modal").close();
          setModalToOpen("edit_guest_modal");
        }}
        onDelete={() => {
          document.getElementById("view_guest_modal").close();
          if (selectedGuest?.id) {
            removeGuests({ inviteIds: [selectedGuest.id] });
          }
        }}
      />
      <GuestEditModal guest={selectedGuest} />

      {/* Session Selection Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Select Session for Attendance</h3>
            
            {guestForAttendance && (
              <p className="text-sm text-gray-600 mb-4">
                Marking attendance for: <span className="font-medium">{guestForAttendance.name}</span>
              </p>
            )}

            <div className="space-y-2 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Session
              </label>
              <select
                value={sessionForAttendance || "all"}
                onChange={(e) => setSessionForAttendance(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="all">General Attendance (All Sessions)</option>
                {event?.sessions?.map((session) => (
                  <option key={session.id} value={session.id}>
                    {session.name} - {new Date(session.date).toLocaleDateString()}
                    {session.start_time && ` at ${session.start_time}`}
                  </option>
                ))}
              </select>
            </div>

            {sessionForAttendance && sessionForAttendance !== "all" && (
              <div className="mb-4 p-3 bg-gray-50 rounded">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{event?.sessions?.find(s => s.id === sessionForAttendance)?.date}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{event?.sessions?.find(s => s.id === sessionForAttendance)?.start_time}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <CustomButton
                buttonText="Cancel"
                buttonColor="bg-gray-300"
                textColor="text-gray-700"
                radius="rounded-md"
                onClick={() => {
                  setShowSessionModal(false);
                  setGuestForAttendance(null);
                  setSessionForAttendance(null);
                }}
              />
              <CustomButton
                buttonText="Mark Attendance"
                buttonColor="bg-purple-600"
                radius="rounded-md"
                onClick={handleMarkSessionAttendance}
                isLoading={markingAttendance}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestListTab;
