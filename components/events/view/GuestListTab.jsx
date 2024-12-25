import PaginationRounded from "@/components/Pagination";
import StatusButton from "@/components/StatusButton";
import TablesComponent from "@/components/TablesComponent";
import React from "react";

const GuestListTab = () => {
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
            // isLoading={isLoading}
            data={[...Array(30)]}
            getFormattedValue={getFormattedValue}
            headers={headers}
            buttonFunction={() => {}}
            options={["View Guest", "Edit Guest Info", "Remove Guest"]}
            // Close popup function
          />
        }
      </div>
      <div className="flex items-center justify-between mt-4">
        <p className="text-14px text-brandBlack">1-10 of 195 items</p>
        <PaginationRounded
          defaultPage={1}
          count={100}
          onChange={(page) => {
            setCurrentPage(page);
          }}
        />
      </div>
    </div>
  );
};

export default GuestListTab;
