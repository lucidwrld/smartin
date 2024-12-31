import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import CustomButton from "@/components/Button";
import useGetSearchForTablesAndGuestsManager from "@/app/events/controllers/tables/getSearchForTablesAndGuestsController";

const TableSearch = ({ eventId }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isAssigning, setIsAssigning] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 1000);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data: searchResult,
    isLoading: loadingSearch,
    refetch,
  } = useGetSearchForTablesAndGuestsManager({
    eventId: eventId,
    enabled: Boolean(debouncedQuery.length > 0),
    searchQuery: debouncedQuery,
  });

  // Get the data from the search results
  const tables = searchResult?.data?.tables || [];
  const guests = searchResult?.data?.guests || [];
  const lowercaseQuery = debouncedQuery.toLowerCase();

  // Get tables both from the tables array and from guests with table assignments
  const matchingTables = new Map();

  // Add tables from direct tables array
  tables.forEach((table) => {
    if (
      table.name.toLowerCase().includes(lowercaseQuery) ||
      table.guests?.some((guest) =>
        guest.name.toLowerCase().includes(lowercaseQuery)
      )
    ) {
      matchingTables.set(table._id, table);
    }
  });

  // Add tables from guests who have table assignments
  guests.forEach((guest) => {
    if (guest.name.toLowerCase().includes(lowercaseQuery) && guest.table) {
      matchingTables.set(guest.table._id, {
        ...guest.table,
        guests: guest.table.guests || [],
      });
    }
  });

  const filteredTables = Array.from(matchingTables.values());

  // Filter unassigned guests
  const filteredGuests = guests.filter(
    (guest) => guest.name.toLowerCase().includes(lowercaseQuery) && !guest.table
  );

  const handleAssignGuest = async (guestId, tableId) => {
    if (!tableId) return;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Search</h2>
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search tables or participants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <CustomButton
          buttonText="Search"
          buttonColor="bg-purple-600"
          radius="rounded-full"
          icon={<Search size={16} />}
          isLoading={loadingSearch}
          onClick={() => refetch()}
        />
      </div>

      {loadingSearch ? (
        <div className="mt-4 text-gray-500">Searching...</div>
      ) : (
        debouncedQuery && (
          <div className="mt-4">
            {/* Matching Tables Section */}
            <div className="mb-4">
              <h3 className="font-medium mb-2">Matching Tables:</h3>
              {filteredTables.length > 0 ? (
                <div className="space-y-2">
                  {filteredTables.map((table) => (
                    <div key={table._id} className="p-2 border rounded">
                      <p>
                        Table {table.name} (
                        {table.no_of_seats - table.seats_occupied} seats
                        available)
                      </p>
                      <div className="text-sm text-gray-600">
                        Assigned:{" "}
                        {table.guests?.length > 0
                          ? table.guests.map((guest) => guest.name).join(", ")
                          : "None"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No matching tables found</p>
              )}
            </div>

            {/* Matching Unassigned Guests Section */}
            <div>
              <h3 className="font-medium mb-2">Matching Unassigned Guests:</h3>
              {filteredGuests.length > 0 ? (
                <div className="space-y-2">
                  {filteredGuests.map((guest) => (
                    <div
                      key={guest._id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <div>
                        <span>{guest.name}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          Code: {guest.code}
                        </span>
                      </div>
                      <select
                        onChange={(e) =>
                          handleAssignGuest(guest._id, e.target.value)
                        }
                        className="border rounded px-2 py-1"
                        defaultValue=""
                        disabled={isAssigning}
                      >
                        <option value="">Assign to table...</option>
                        {tables
                          .filter(
                            (table) =>
                              table.no_of_seats - table.seats_occupied > 0
                          )
                          .map((table) => (
                            <option key={table._id} value={table._id}>
                              Table {table.name} (
                              {table.no_of_seats - table.seats_occupied} seats)
                            </option>
                          ))}
                      </select>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">
                  No matching unassigned guests found
                </p>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TableSearch;
