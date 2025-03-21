import React, { useState } from "react";
import useGetAllTablesManager from "@/app/events/controllers/tables/getAllTablesController";
import Loader from "@/components/Loader";
import CompletePagination from "@/components/CompletePagination";

const PublicTableList = ({ eventId, accessCode }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useGetAllTablesManager({
    eventId: eventId,
    page: currentPage,
    code: accessCode, // Pass the access code to the hook
    enabled: Boolean(eventId),
  });

  // Get the tables data
  const tables = data?.data || [];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Tables</h2>
      {isLoading ? (
        <Loader />
      ) : tables.length === 0 ? (
        <p className="text-gray-500 text-center py-4">
          No tables available for this event
        </p>
      ) : (
        <div className="space-y-4">
          {tables.map((table) => (
            <div
              key={table?.id || table?._id}
              className="border rounded-lg p-3 md:p-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <span className="font-medium">
                    {table?.name.startsWith("Table")
                      ? table?.name
                      : `Table ${table?.name}`}
                  </span>
                  <span className="text-gray-600">
                    {table?.seats_occupied || table?.guests?.length || 0}/
                    {table?.no_of_seats} seats filled
                  </span>
                </div>
              </div>

              <div className="mt-3 md:mt-4">
                <h4 className="font-medium mb-2">Assigned Guests:</h4>
                {table?.guests?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {table.guests.map((guest) => (
                      <div
                        key={guest.id || guest._id}
                        className="bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-sm flex flex-col"
                      >
                        <span className="font-medium">{guest.name}</span>
                        <span className="text-xs text-purple-500">
                          {guest.phone}
                        </span>
                        <span className="text-xs mt-1">
                          <span
                            className={`px-2 py-0.5 rounded-full ${
                              guest.response === "accepted"
                                ? "bg-green-100 text-green-800"
                                : guest.response === "declined"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {guest.response === "accepted"
                              ? "Accepted"
                              : guest.response === "declined"
                              ? "Declined"
                              : "Pending"}
                          </span>
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No guests assigned to this table yet
                  </p>
                )}
              </div>
            </div>
          ))}

          {tables.length > 0 && data?.pagination && (
            <CompletePagination
              setCurrentPage={setCurrentPage}
              pagination={data.pagination}
              suffix="Tables"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PublicTableList;
