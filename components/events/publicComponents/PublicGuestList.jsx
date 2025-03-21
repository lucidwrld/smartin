import React, { useState, useEffect } from "react";
import { Users, UserCheck, Clock } from "lucide-react";
import CompletePagination from "@/components/CompletePagination";
import TablesComponent from "@/components/TablesComponent";
import useGetEventInviteesManager from "@/app/events/controllers/getEventInviteesController";
import StatusButton from "@/components/StatusButton";
import StatusButtonWithBool from "@/components/StatusWithBool";

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

const PublicGuestList = ({ eventId, accessCode }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useGetEventInviteesManager({
    eventId,
    page: currentPage,
    code: accessCode, // Pass the access code to the hook
  });

  // Stats calculated from the guest data
  const totalGuests = data?.pagination?.total || 0;
  const pendingGuests =
    data?.data?.filter((guest) => guest.response === "pending").length || 0;
  const attendedGuests =
    data?.data?.filter((guest) => guest.attended).length || 0;

  const stats = [
    {
      icon: Users,
      label: "Total Guests",
      value: totalGuests,
    },
    {
      icon: Clock,
      label: "Pending",
      value: pendingGuests,
    },
    {
      icon: UserCheck,
      label: "Attended",
      value: attendedGuests,
    },
  ];

  const headers = [
    "Guest name",
    "Phone",
    "Email",
    "Acceptance",
    "Attendance",
    "Table",
  ];

  const getFormattedValue = (guest) => [
    guest?.name,
    guest?.phone,
    guest?.email || "No email",
    <StatusButton
      status={
        guest?.response === "accepted"
          ? "Accepted"
          : guest?.response === "declined"
          ? "Declined"
          : "Pending"
      }
    />,
    <StatusButton status={guest?.attended ? "Attended" : "Not Attended"} />,
    guest?.table ? guest.table.name : "-",
  ];

  return (
    <div className="mt-4 md:mt-6 flex flex-col w-full gap-3 md:gap-4 text-brandBlack p-2 md:p-0">
      <div className="flex flex-col md:flex-row gap-3 md:gap-4">
        <div className="grid grid-cols-3 md:flex md:flex-row gap-2 md:gap-4">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
            />
          ))}
        </div>
      </div>

      <div className="h-[50vh] md:h-[67vh] w-full relative overflow-x-auto">
        <TablesComponent
          isLoading={isLoading}
          data={data?.data || []}
          getFormattedValue={getFormattedValue}
          headers={headers}
          className="min-w-[800px]"
          hideActionButton={true}
          showCheckBox={false}
          //   isViewOnly={true} // Disable selection and actions since this is a read-only view
        />
      </div>

      {data?.data?.length > 0 && (
        <div className="mt-2 md:mt-0">
          <CompletePagination
            setCurrentPage={setCurrentPage}
            pagination={data?.pagination}
            suffix="Guests"
          />
        </div>
      )}
    </div>
  );
};

export default PublicGuestList;
