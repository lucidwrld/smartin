import { AssignUnassignGuestsManager } from "@/app/events/controllers/tables/assignUnassignGuestToTableController";
import useGetEventInviteesManager from "@/app/events/controllers/getEventInviteesController";
import Loader from "@/components/Loader";
import React, { useState } from "react";

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
    // assign participant

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
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        Unassigned Participants ({data?.data.length})
      </h2>
      <div className="flex flex-wrap gap-2">
        {data?.data.map((participant) => (
          <div
            key={participant.id}
            className="bg-gray-100 px-3 py-2 rounded-lg text-sm flex items-center gap-2"
          >
            {participant.name}
            <select
              onChange={(e) => {
                if (e.target.value) {
                  assignParticipant(participant?.id, e.target.value);
                }
              }}
              className="ml-2 border rounded px-2 py-1"
              defaultValue=""
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
    </div>
  );
};

export default UnassignedGuests;
