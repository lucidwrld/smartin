"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import CustomButton from "@/components/Button";
import TableList from "../tables/TableList";
import AddNewTable from "../tables/AddNewTable";
import UnassignedGuests from "../tables/UnassignedGuests";
import TabManager from "@/components/TabManager";
import useGetAllTablesManager from "@/app/events/controllers/tables/getAllTablesController";
import useGetSearchForTablesAndGuestsManager from "@/app/events/controllers/tables/getSearchForTablesAndGuestsController";
import TableSearch from "../tables/SearchSection";

const TableArrangement = ({ eventId }) => {
  const [tables, setTables] = useState([]);
  const [currentView, setCurrentView] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [searchResults, setSearchResults] = useState({
    tables: [],
    participants: [],
  });
  const [currentPage, setCurrentPage] = useState(1);
  const {
    data: searchResult,
    isLoading: loadingSearch,
    refetch,
  } = useGetSearchForTablesAndGuestsManager({
    eventId: eventId,
    enabled: Boolean(searchQuery.length > 0),
    searchQuery: searchQuery,
  });
  const { data: apiTables, isLoading } = useGetAllTablesManager({
    eventId: eventId,
    page: currentPage,
    enabled: Boolean(eventId),
  });

  const handleSearch = () => {
    // const query = searchQuery.toLowerCase();
    refetch();
    // const filteredTables = tables.filter(
    //   (table) =>
    //     table.name.toLowerCase().includes(query) ||
    //     table.assignedParticipants?.some((p) =>
    //       p.name.toLowerCase().includes(query)
    //     )
    // );

    // const filteredParticipants = unassignedParticipants.filter((p) =>
    //   p.name.toLowerCase().includes(query)
    // );

    // setSearchResults({
    //   tables: filteredTables,
    //   participants: filteredParticipants,
    // });
  };

  return (
    <div className="w-full mx-auto p-6 text-brandBlack">
      {/* Search Section */}
      <TableSearch eventId={eventId} />

      {/* Add new table section */}
      <AddNewTable tables={tables} setTables={setTables} />

      <TabManager
        currentView={currentView}
        setCurrentView={setCurrentView}
        list={["Tables", "Unassigned Guests"]}
      />

      {/* Tables list */}
      {currentView === 0 && (
        <TableList
          isLoading={isLoading}
          data={apiTables}
          tables={tables}
          eventId={eventId}
          setCurrentPage={setCurrentPage}
          setTables={setTables}
        />
      )}
      {/* Unassigned participants */}
      {currentView === 1 && (
        <UnassignedGuests
          eventId={eventId}
          apiTables={apiTables?.data}
          tables={tables}
        />
      )}
    </div>
  );
};

export { TableArrangement };
