import React, { useState } from "react";
import { Trash2, Copy, Edit2 } from "lucide-react";

const TableList = ({
  tables,
  setTables,
  setUnassignedParticipants,
  unassignedParticipants,
}) => {
  const [editingTableId, setEditingTableId] = useState(null);

  const getFilteredData = () => {
    return tables;
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
  return (
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
                        onClick={() => removeParticipant(participant, table.id)}
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
  );
};

export default TableList;
