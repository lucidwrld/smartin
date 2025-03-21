import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import useGetSearchForTablesAndGuestsManager from "@/app/events/controllers/tables/getSearchForTablesAndGuestsController";

const PublicSearch = ({ eventId, accessCode }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

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
    code: accessCode, // Pass the access code to the hook
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

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Search</h2>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          placeholder="Search guests or tables..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => {
              setSearchQuery("");
              setDebouncedQuery("");
            }}
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
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
                    <div key={guest._id} className="p-2 border rounded">
                      <div>
                        <span>{guest.name}</span>
                        <span className="ml-2 text-sm text-gray-500">
                          Code: {guest.code}
                        </span>
                      </div>
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

export default PublicSearch;
