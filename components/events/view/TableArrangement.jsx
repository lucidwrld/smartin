"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import CustomButton from "@/components/Button";
import TableList from "../tables/TableList";
import AddNewTable from "../tables/AddNewTable";

const TableArrangement = ({ eventId }) => {
  const [tables, setTables] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    tables: [],
    participants: [],
  });

  // Mock data - replace with your actual data
  const [unassignedParticipants, setUnassignedParticipants] = useState([
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Bob Johnson" },
  ]);
  // Table naming and management functions

  const assignParticipant = (participant, tableId) => {
    const targetTable = tables.find((t) => t.id === tableId);
    if (!targetTable || targetTable.remainingSeats <= 0) {
      alert("No available seats at this table");
      return;
    }

    setTables(
      tables.map((table) => {
        if (table.id === tableId) {
          return {
            ...table,
            assignedParticipants: [
              ...(table.assignedParticipants || []),
              participant,
            ],
            remainingSeats: table.remainingSeats - 1,
          };
        }
        return table;
      })
    );

    setUnassignedParticipants(
      unassignedParticipants.filter((p) => p.id !== participant.id)
    );
  };

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const filteredTables = tables.filter(
      (table) =>
        table.name.toLowerCase().includes(query) ||
        table.assignedParticipants?.some((p) =>
          p.name.toLowerCase().includes(query)
        )
    );

    const filteredParticipants = unassignedParticipants.filter((p) =>
      p.name.toLowerCase().includes(query)
    );

    setSearchResults({
      tables: filteredTables,
      participants: filteredParticipants,
    });
  };

  return (
    <div className="w-full mx-auto p-6 text-brandBlack">
      {/* Search Section */}
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
            onClick={handleSearch}
          />
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mt-4">
            <div className="mb-4">
              <h3 className="font-medium mb-2">Matching Tables:</h3>
              {searchResults.tables.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.tables.map((table) => (
                    <div key={table.id} className="p-2 border rounded">
                      <p>
                        Table {table.name} ({table.remainingSeats} seats
                        available)
                      </p>
                      <div className="text-sm text-gray-600">
                        Assigned:{" "}
                        {table.assignedParticipants
                          ?.map((p) => p.name)
                          .join(", ") || "None"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No matching tables found</p>
              )}
            </div>

            <div>
              <h3 className="font-medium mb-2">Matching Participants:</h3>
              {searchResults.participants.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.participants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span>{participant.name}</span>
                      <select
                        onChange={(e) =>
                          assignParticipant(
                            participant,
                            parseInt(e.target.value)
                          )
                        }
                        className="border rounded px-2 py-1"
                        defaultValue=""
                      >
                        <option value="">Assign to table...</option>
                        {tables
                          .filter((table) => table.remainingSeats > 0)
                          .map((table) => (
                            <option key={table.id} value={table.id}>
                              Table {table.name} ({table.remainingSeats} seats)
                            </option>
                          ))}
                      </select>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No matching participants found</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add new table section */}
      <AddNewTable tables={tables} setTables={setTables} />

      {/* Tables list */}
      <TableList
        tables={tables}
        setTables={setTables}
        setUnassignedParticipants={setUnassignedParticipants}
        unassignedParticipants={unassignedParticipants}
      />
      {/* Unassigned participants */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Unassigned Participants ({unassignedParticipants.length})
        </h2>
        <div className="flex flex-wrap gap-2">
          {unassignedParticipants.map((participant) => (
            <div
              key={participant.id}
              className="bg-gray-100 px-3 py-2 rounded-lg text-sm flex items-center gap-2"
            >
              {participant.name}
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    assignParticipant(participant, parseInt(e.target.value));
                  }
                }}
                className="ml-2 border rounded px-2 py-1"
                defaultValue=""
              >
                <option value="">Assign to table...</option>
                {tables
                  .filter((table) => table.remainingSeats > 0)
                  .map((table) => (
                    <option key={table.id} value={table.id}>
                      Table {table.name}
                    </option>
                  ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Save button section */}
      {tables.length > 0 && (
        <div className="flex justify-end">
          <CustomButton
            buttonText="Save Arrangement"
            buttonColor="bg-purple-600"
            radius="rounded-full"
            onClick={() =>
              console.log("Save arrangement:", {
                tables,
                unassignedParticipants,
              })
            }
          />
        </div>
      )}
    </div>
  );
};

export { TableArrangement };
