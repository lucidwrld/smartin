import React, { useEffect, useState } from "react";
import { Trash2, Copy, Edit2 } from "lucide-react";
import useGetAllTablesManager from "@/app/events/controllers/tables/getAllTablesController";
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
  const { manageAssignment, isLoading: unassigning } =
    AssignUnassignGuestsManager({ isAdd: false });

  const [newTableName, setNewTableName] = useState("");
  const [newSeatNumber, setNewSeatNumber] = useState("");
  const [tableId, setTableId] = useState(null);
  const [editingTableId, setEditingTableId] = useState(null);

  const {
    deleteTable,
    isLoading: deleting,
    isSuccess: deleted,
  } = DeleteTableManager({ tableId: tableId });

  useEffect(() => {
    if (deleted) {
      document.getElementById("delete").close();
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
    // Find all tables with the same base identifier
    const tablesWithSameBase = data?.data.filter(
      (t) => t.name.replace(/\d+$/, "") === table.name.replace(/\d+$/, "")
    );

    // Get the highest number suffix
    let highestNumber = 0;
    tablesWithSameBase.forEach((t) => {
      const match = t.name.match(/\d+$/);
      if (match) {
        const num = parseInt(match[0]);
        if (num > highestNumber) {
          highestNumber = num;
        }
      }
    });

    // Create new table name with incremented number
    const baseTableName = table.name.replace(/\d+$/, "");
    const newTableName = `${baseTableName}${highestNumber + 1}`;

    const duplicatedTable = {
      ...table,
      event: eventId,
      name: newTableName,
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
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Tables</h2>
      {isLoading ? (
        <Loader />
      ) : data?.data.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No tables added yet</p>
      ) : (
        <div className="space-y-4">
          {getFilteredData().map((table) => (
            <div
              key={table?.id}
              className="border rounded-lg p-3 md:p-4 hover:bg-gray-50"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  {editingTableId === table?.id ? (
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                      <div className="w-full sm:w-48">
                        <InputWithFullBoarder
                          label="Table Name"
                          type="text"
                          value={newTableName}
                          onChange={(e) => setNewTableName(e.target.value)}
                        />
                      </div>
                      <div className="w-full sm:w-48">
                        <InputWithFullBoarder
                          label="Number of Seats"
                          type="number"
                          value={newSeatNumber}
                          onChange={(e) => setNewSeatNumber(e.target.value)}
                          min="1"
                        />
                      </div>
                      <div className="mt-2 sm:mt-0">
                        <CustomButton
                          buttonText="Save"
                          buttonColor="bg-purple-600"
                          radius="rounded-full"
                          isLoading={editing}
                          onClick={() => saveTableEdit(table.id)}
                        />
                      </div>
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
                <div className="flex gap-2 justify-start md:justify-end">
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

              <div className="mt-3 md:mt-4">
                <h4 className="font-medium mb-2">Assigned Participants:</h4>
                <div className="flex flex-wrap gap-2">
                  {table?.guests &&
                    table?.guests.map((participant) => (
                      <div
                        key={participant.id}
                        className="bg-purple-50 text-purple-700 px-3 py-1.5 rounded-full text-sm flex items-center gap-2 max-w-full sm:max-w-[200px]"
                      >
                        <span className="truncate">{participant.name}</span>
                        <button
                          onClick={() =>
                            removeParticipant(participant?.id, table.id)
                          }
                          className="text-purple-400 hover:text-purple-600 flex-shrink-0"
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
