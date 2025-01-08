import { AssignUnassignGuestsManager } from "@/app/events/controllers/tables/assignUnassignGuestToTableController";
import useGetEventInviteesManager from "@/app/events/controllers/getEventInviteesController";
import Loader from "@/components/Loader";
import React, { useState } from "react";
import CompletePagination from "@/components/CompletePagination";

const UnassignedGuests = ({ eventId, apiTables }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { manageAssignment, isLoading: assigning } =
    AssignUnassignGuestsManager({ isAdd: true });

  const { data, isLoading } = useGetEventInviteesManager({
    eventId,
    page: currentPage,
    assigned: false,
  });

  const getAvailableSeats = (table) => {
    return table?.no_of_seats - (table?.seats_occupied || 0);
  };

  const assignParticipant = (participant, tableId) => {
    const targetTable = apiTables.find((t) => t.id === tableId);
    if (
      !targetTable ||
      targetTable?.seats_occupied === targetTable?.no_of_seats
    ) {
      alert("No available seats at this table");
      return;
    }

    const details = {
      eventId: eventId,
      tableId: tableId,
      guestIds: [participant],
    };
    manageAssignment(details);
  };

  return isLoading ? (
    <Loader />
  ) : (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
      <h2 className="text-lg md:text-xl font-semibold mb-4">
        Unassigned Participants ({data?.data.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data?.data.map((participant) => (
          <div
            key={participant.id}
            className="bg-gray-100 p-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full"
          >
            <span className="text-sm font-medium min-w-[120px]">
              {participant.name}
            </span>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  assignParticipant(participant?.id, e.target.value);
                }
              }}
              className="w-full sm:w-auto border rounded px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              defaultValue=""
              disabled={assigning}
            >
              <option value="">Assign to table...</option>
              {apiTables &&
                apiTables
                  .filter((table) => getAvailableSeats(table) > 0)
                  .map((table) => (
                    <option key={table.id} value={table?.id}>
                      Table {table.name} ({getAvailableSeats(table)} seats
                      available)
                    </option>
                  ))}
            </select>
          </div>
        ))}
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

export default UnassignedGuests;
