import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { AddTableManager } from "@/app/events/controllers/tables/addTableController";
import { getParamKeys } from "next/dist/server/request/fallback-params";
import { getQueryParams } from "@/utils/getQueryParams";

const AddNewTable = ({ tables, setTables }) => {
  const { id } = getQueryParams(["id"]);
  const { addTable: addTableAPI, isLoading } = AddTableManager();

  const [newTableName, setNewTableName] = useState("");
  const [newTableSeats, setNewTableSeats] = useState("");
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

  const addTableHandle = async () => {
    if (
      !newTableSeats ||
      isNaN(newTableSeats) ||
      parseInt(newTableSeats) <= 0
    ) {
      alert("Please enter a valid number of seats");
      return;
    }

    const baseIdentifier = getNextIdentifier();
    // const newTable = {
    //   id: Date.now(),
    //   baseIdentifier,
    //   name: newTableName.trim() || baseIdentifier,
    //   seats: parseInt(newTableSeats),
    //   assignedParticipants: [],
    //   remainingSeats: parseInt(newTableSeats),
    // };

    const details = {
      event: id,
      name: newTableName.trim() || baseIdentifier,
      no_of_seats: parseInt(newTableSeats),
    };
    await addTableAPI(details);
    // setTables([...tables, newTable]);
    setNewTableName("");
    setNewTableSeats("");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Add New Table</h2>
      <div className="flex flex-wrap gap-4 items-center">
        <InputWithFullBoarder
          label={"Name (Optional)"}
          type="text"
          value={newTableName}
          onChange={(e) => setNewTableName(e.target.value)}
          placeholder={`${getNextIdentifier()}`}
        />
        <InputWithFullBoarder
          type="number"
          value={newTableSeats}
          onChange={(e) => setNewTableSeats(e.target.value)}
          placeholder="Enter seats"
          min="1"
          label={"Number of Seats"}
          isRequired
        />
        <CustomButton
          buttonText="Add Table"
          buttonColor="bg-purple-600"
          radius="rounded-full"
          icon={<Plus size={16} />}
          onClick={addTableHandle}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AddNewTable;
