import useGetEventInviteesManager from "@/app/events/controllers/getEventInviteesController";
import CompletePagination from "@/components/CompletePagination";
import StatusButton from "@/components/StatusButton";
import TablesComponent from "@/components/TablesComponent";
import React, { useState } from "react";

const GuestListTab = ({ eventId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useGetEventInviteesManager({ eventId: eventId });
  const headers = [
    "Guest name",
    "Phone",
    "Email",
    "Acceptance",
    "Channels",
    "Attendance",
    "Action",
  ];

  const getFormattedValue = (el, index) => {
    return [
      "001",
      "John Doe",
      "08068111435",
      "Johndoe@email.com",
      <StatusButton status={"accepted"} />,
      <div className="flex items-center gap-2">
        <StatusButton status={"WhatsApp"} />
        <StatusButton status={"SMS"} />
        <StatusButton status={"Email"} />
      </div>,
    ];
  };
  return (
    <div className="mt-6 flex flex-col w-full gap-4">
      <div className="h-[67vh] w-full relative">
        {
          <TablesComponent
            isLoading={isLoading}
            data={data?.data}
            getFormattedValue={getFormattedValue}
            headers={headers}
            options={["View Guest", "Edit Guest Info", "Remove Guest"]}
            // Close popup function
          />
        }
      </div>
      {data?.data.length > 0 && (
        <CompletePagination
          setCurrentPage={setCurrentPage}
          pagination={data?.pagination}
          suffix={"Guests"}
        />
      )}
    </div>
  );
};

export default GuestListTab;
