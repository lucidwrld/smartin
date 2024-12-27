"use client";

import React, { useState } from "react";
import { Trash2, Copy, Plus, Edit2, Search, Users } from "lucide-react";
import CustomButton from "@/components/Button";

const TableArrangement = ({ eventId }) => {
  const [tables, setTables] = useState([]);
  const [newTableName, setNewTableName] = useState("");
  const [newTableSeats, setNewTableSeats] = useState("");
  const [editingTableId, setEditingTableId] = useState(null);
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
  const getNextIdentifier = () => {
    if (tables.length === 0) return "A";
    const lastBase = tables[tables.length - 1].baseIdentifier;

    if (lastBase === "Z") return "AA";
    if (lastBase.length > 1) {
      const lastChar = lastBase[lastBase.length - 1];
      if (lastChar === "Z") {
        return (
          lastBase.slice(0, -1) +
          String.fromCharCode(lastBase.charCodeAt(lastBase.length - 2) + 1) +
          "A"
        );
      }
      return (
        lastBase.slice(0, -1) + String.fromCharCode(lastChar.charCodeAt(0) + 1)
      );
    }
    return String.fromCharCode(lastBase.charCodeAt(0) + 1);
  };

  const addTable = () => {
    if (
      !newTableSeats ||
      isNaN(newTableSeats) ||
      parseInt(newTableSeats) <= 0
    ) {
      alert("Please enter a valid number of seats");
      return;
    }

    const baseIdentifier = getNextIdentifier();
    const newTable = {
      id: Date.now(),
      baseIdentifier,
      name: newTableName.trim() || baseIdentifier,
      seats: parseInt(newTableSeats),
      assignedParticipants: [],
      remainingSeats: parseInt(newTableSeats),
    };

    setTables([...tables, newTable]);
    setNewTableName("");
    setNewTableSeats("");
  };

  const duplicateTable = (table) => {
    const duplicateNum =
      tables.filter((t) => t.baseIdentifier === table.baseIdentifier).length +
      1;
    const duplicatedTable = {
      ...table,
      id: Date.now(),
      name: `${table.baseIdentifier}${duplicateNum}`,
      assignedParticipants: [],
      remainingSeats: table.seats,
    };
    setTables([...tables, duplicatedTable]);
  };

  const deleteTable = (id) => {
    const table = tables.find((t) => t.id === id);
    setUnassignedParticipants([
      ...unassignedParticipants,
      ...(table.assignedParticipants || []),
    ]);
    setTables(tables.filter((table) => table.id !== id));
  };

  const startEditing = (table) => {
    setEditingTableId(table.id);
    setNewTableName(table.name);
  };

  const saveTableEdit = (tableId) => {
    setTables(
      tables.map((table) =>
        table.id === tableId
          ? { ...table, name: newTableName.trim() || table.baseIdentifier }
          : table
      )
    );
    setEditingTableId(null);
    setNewTableName("");
  };

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

  const removeParticipant = (participant, tableId) => {
    setTables(
      tables.map((table) => {
        if (table.id === tableId) {
          return {
            ...table,
            assignedParticipants: table.assignedParticipants.filter(
              (p) => p.id !== participant.id
            ),
            remainingSeats: table.remainingSeats + 1,
          };
        }
        return table;
      })
    );
    setUnassignedParticipants([...unassignedParticipants, participant]);
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

  const getFilteredData = () => {
    return tables;
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
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Table</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name (Optional)
            </label>
            <input
              type="text"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              placeholder={`${getNextIdentifier()}`}
              className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Seats *
            </label>
            <input
              type="number"
              value={newTableSeats}
              onChange={(e) => setNewTableSeats(e.target.value)}
              placeholder="Enter seats"
              min="1"
              className="border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <CustomButton
            buttonText="Add Table"
            buttonColor="bg-purple-600"
            radius="rounded-full"
            icon={<Plus size={16} />}
            onClick={addTable}
          />
        </div>
      </div>

      {/* Tables list */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Tables</h2>
        {tables.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No tables added yet</p>
        ) : (
          <div className="space-y-4">
            {getFilteredData().map((table) => (
              <div
                key={table.id}
                className="border rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    {editingTableId === table.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTableName}
                          onChange={(e) => setNewTableName(e.target.value)}
                          className="border rounded-md px-2 py-1"
                        />
                        <CustomButton
                          buttonText="Save"
                          buttonColor="bg-purple-600"
                          radius="rounded-full"
                          onClick={() => saveTableEdit(table.id)}
                        />
                      </div>
                    ) : (
                      <>
                        <span className="font-medium">Table {table.name}</span>
                        <span className="text-gray-600">
                          {table.remainingSeats}/{table.seats} seats available
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditing(table)}
                      className="p-2 text-gray-600 hover:text-purple-600 rounded-full hover:bg-purple-50"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => duplicateTable(table)}
                      className="p-2 text-gray-600 hover:text-purple-600 rounded-full hover:bg-purple-50"
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      onClick={() => deleteTable(table.id)}
                      className="p-2 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Assigned participants */}
                <div className="mt-2">
                  <h4 className="font-medium mb-2">Assigned Participants:</h4>
                  <div className="flex flex-wrap gap-2">
                    {table.assignedParticipants.map((participant) => (
                      <div
                        key={participant.id}
                        className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {participant.name}
                        <button
                          onClick={() =>
                            removeParticipant(participant, table.id)
                          }
                          className="text-purple-400 hover:text-purple-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
