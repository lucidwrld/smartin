import React, { useEffect, useState } from "react";
import { Trash2, Copy, Edit2 } from "lucide-react";
import useGetAllTablesManager from "@/app/events/controllers/tables/getAllTablesController";
import { getQueryParams } from "@/utils/getQueryParams";
import Loader from "@/components/Loader";
import CompletePagination from "@/components/CompletePagination";
import { AddTableManager } from "@/app/events/controllers/tables/addTableController";
import { EditTableManager } from "@/app/events/controllers/tables/editTableController";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import CustomButton from "@/components/Button";
import { AssignUnassignGuestsManager } from "@/app/events/controllers/tables/assignUnassignGuestToTableController";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { DeleteTableManager } from "@/app/events/controllers/tables/deleteTableController";

const TableList = ({ isLoading, data, setCurrentPage, eventId }) => {
  const { id } = getQueryParams(["id"]);
  const { manageAssignment, isLoading: unassigning } =
    AssignUnassignGuestsManager({ isAdd: false });

  // Add these state declarations after other useState declarations
  const [newTableName, setNewTableName] = useState("");
  const [newSeatNumber, setNewSeatNumber] = useState("");
  const [tableId, setTableId] = useState(null);
  // Move the editingTableId state declaration before the hooks
  const [editingTableId, setEditingTableId] = useState(null);
  const {
    deleteTable,
    isLoading: deleting,
    isSuccess: deleted,
  } = DeleteTableManager({ tableId: tableId });

  useEffect(() => {
    if (deleted) {
      document.getElementById("delete").closest();
    }
  }, [deleted]);

  const { addTable: addTableAPI, isLoading: duplicating } = AddTableManager();
  const { editTable, isLoading: editing } = EditTableManager({
    tableId: editingTableId,
  });

  const getFilteredData = () => {
    return data?.data || [];
  };

  const removeParticipant = (participant, tableId) => {
    const details = {
      eventId: eventId,
      tableId: tableId,
      guestIds: [participant],
    };
    manageAssignment(details);
  };

  const duplicateTable = async (table) => {
    const duplicateNum =
      data?.data.filter((t) => t.baseIdentifier === table.baseIdentifier)
        .length + 1;
    const duplicatedTable = {
      ...table,
      event: id,
      name: `${table?.name}${duplicateNum}`,
      no_of_seats: table?.no_of_seats,
    };

    await addTableAPI(duplicatedTable);
  };

  const deleteTableFn = (id) => {
    setTableId(id);
    document.getElementById("delete").showModal();
  };
  const startEditing = (table) => {
    setEditingTableId(table?.id);
    setNewTableName(table?.name);
    setNewSeatNumber(table?.no_of_seats.toString());
  };

  const saveTableEdit = async (tableId) => {
    try {
      if (
        !newSeatNumber ||
        isNaN(newSeatNumber) ||
        parseInt(newSeatNumber) <= 0
      ) {
        alert("Please enter a valid number of seats");
        return;
      }

      const updatedData = {
        name: newTableName.trim(),
        no_of_seats: parseInt(newSeatNumber),
      };

      await editTable(updatedData);

      setEditingTableId(null);
      setNewTableName("");
      setNewSeatNumber("");
    } catch (error) {
      console.error("Error updating table:", error);
      alert("Failed to update table. Please try again.");
    }
  };
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Tables</h2>
      {isLoading ? (
        <Loader />
      ) : data?.data.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No tables added yet</p>
      ) : (
        <div className="space-y-4">
          {getFilteredData().map((table) => (
            <div
              key={table?.id}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-4">
                  {editingTableId === table?.id ? (
                    <div className="flex gap-2">
                      <InputWithFullBoarder
                        label="Table Name"
                        type="text"
                        value={newTableName}
                        onChange={(e) => setNewTableName(e.target.value)}
                      />
                      <InputWithFullBoarder
                        label="Number of Seats"
                        type="number"
                        value={newSeatNumber}
                        onChange={(e) => setNewSeatNumber(e.target.value)}
                        min="1"
                      />
                      <CustomButton
                        buttonText="Save"
                        buttonColor="bg-purple-600"
                        radius="rounded-full"
                        isLoading={editing}
                        onClick={() => saveTableEdit(table.id)}
                      />
                    </div>
                  ) : (
                    <>
                      <span className="font-medium">Table {table?.name}</span>
                      <span className="text-gray-600">
                        {table.no_of_seats - table?.seats_occupied}/
                        {table.no_of_seats} seats available
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
                    onClick={() => deleteTableFn(table.id)}
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
                  {table?.guests &&
                    table?.guests.map((participant) => (
                      <div
                        key={participant.id}
                        className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                      >
                        {participant.name}
                        <button
                          onClick={() =>
                            removeParticipant(participant?.id, table.id)
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
          {data?.data.length > 0 && (
            <CompletePagination
              setCurrentPage={setCurrentPage}
              pagination={data?.pagination}
              suffix={"Tables"}
            />
          )}
        </div>
      )}
      <DeleteConfirmationModal
        title={"Delete Table"}
        body={`Are you sure you want to delete this table?`}
        buttonText={"Delete Table"}
        isLoading={deleting}
        onClick={() => deleteTable()}
      />
    </div>
  );
};

export default TableList;
