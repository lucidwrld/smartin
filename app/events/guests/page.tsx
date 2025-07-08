"use client";

import React, { useState, useEffect } from "react";
import { Users, UserCheck, Clock, Grid } from "lucide-react";
import useGetAccessCodeDetailsManager from "../controllers/members/getAccessCodeInformationController";
import { useSearchParams } from "next/navigation";
import PublicSearch from "@/components/events/publicComponents/PublicSearch";
import PublicGuestList from "@/components/events/publicComponents/PublicGuestList";
import PublicTableList from "@/components/events/publicComponents/PublicTableList";
import { logoMain1 } from "@/public/images";

const PublicEventView = () => {
  const searchParams = useSearchParams();
  const accessCode = searchParams.get("c");

  // Check if accessCode is not found
  if (!accessCode) {
    return (
      <div className="max-w-4xl mx-auto p-4 flex flex-col justify-center items-center h-screen">
        <img src={logoMain1.src} alt="" className="w-[80%] mb-10" />
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Access Code Not Found
          </h2>
          <p className="text-gray-600">
            Please ensure you have the correct URL with the access code.
          </p>
        </div>
      </div>
    );
  }

  const { isLoading: loadingEventData, data: accessCodeData } =
    useGetAccessCodeDetailsManager({
      code: accessCode,
    });

  const [event, setEvent] = useState(null);
  const [guests, setGuests] = useState([]);
  const [tables, setTables] = useState([]);
  const [filteredGuests, setFilteredGuests] = useState([]);
  const [filteredTables, setFilteredTables] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [activeTab, setActiveTab] = useState("guests"); // "guests" or "tables"

  // Set the event data when it loads
  useEffect(() => {
    if (accessCodeData && accessCodeData.data) {
      setEvent(accessCodeData.data.event);
      // Initialize with empty arrays since guests and tables will come from search
      setGuests([]);
      setTables([]);
      setFilteredGuests([]);
      setFilteredTables([]);
    }
  }, [accessCodeData]);

  // Handle search results
  const handleSearchResults = ({
    tables: searchTables,
    guests: searchGuests,
  }) => {
    if (searchTables?.length > 0 || searchGuests?.length > 0) {
      setIsSearchActive(true);

      // Process tables to include their assigned guests
      const tablesWithGuests =
        searchTables?.map((table) => {
          const tableGuests = searchGuests?.filter(
            (g) => g.table && g.table._id === table._id
          );
          return {
            ...table,
            assignedGuests: tableGuests?.map((g) => g._id) || [],
          };
        }) || [];

      setFilteredTables(tablesWithGuests);

      // Set guests from search results
      setFilteredGuests(searchGuests || []);
    } else {
      setIsSearchActive(false);
      setFilteredGuests(guests);
      setFilteredTables(tables);
    }
  };

  // Loading skeleton
  if (loadingEventData) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // If no event data is available
  if (!loadingEventData && !event) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Event Not Found</h2>
          <p>
            The event you're looking for could not be found or the access code
            is invalid.
          </p>
        </div>
      </div>
    );
  }

  // Check if this is a view-only access code
  const isViewOnly = accessCodeData?.data?.permissions?.view_only === true;

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Event Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{event.name}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center mt-2 text-gray-600">
          <div className="mr-4">
            <span className="font-medium">Date:</span>{" "}
            {new Date(event.date).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Location:</span>{" "}
            {event.isVirtual ? "Virtual Event" : event.venue}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Total Guests</p>
            <p className="text-xl font-semibold">{event.no_of_invitees || 0}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="p-3 bg-yellow-100 rounded-full">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-xl font-semibold">{event.no_of_invitees || 0}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="p-3 bg-green-100 rounded-full">
            <UserCheck className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Attended</p>
            <p className="text-xl font-semibold">0</p>
          </div>
        </div>
      </div>

      {/* Search Box - replaced with PublicSearch component */}
      <PublicSearch
        eventId={event.id || event._id}
        accessCode={accessCode}
        onSearchResults={handleSearchResults}
      />

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${
              activeTab === "guests"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("guests")}
          >
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Guest List
            </div>
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${
              activeTab === "tables"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("tables")}
          >
            <div className="flex items-center">
              <Grid className="mr-2 h-4 w-4" />
              Table Arrangement
            </div>
          </button>
        </div>
      </div>

      {/* Guest List Tab */}
      {/* Guest List Tab */}
      {activeTab === "guests" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <PublicGuestList
            accessCode={accessCode}
            eventId={event.id || event._id}
          />
        </div>
      )}

      {/* Tables Tab */}
      {/* Tables Tab */}
      {activeTab === "tables" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <PublicTableList
            eventId={event.id || event._id}
            accessCode={accessCode}
          />
        </div>
      )}

      {/* Footer with access code information */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border text-center">
        <p className="text-sm text-gray-500">
          You're viewing this event with a read-only access code. This view
          shows the current guest list and table assignments.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Access Code: {accessCode || "VIEW-XXXX-XXX"}
        </p>
      </div>
    </div>
  );
};

export default PublicEventView;
