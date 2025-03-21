"use client";

import React, { useState, useEffect } from "react";
import { Search, UserCheck, Users, X, Check, QrCode } from "lucide-react";
import { useSearchParams } from "next/navigation";
import useGetEventInviteesManager from "@/app/events/controllers/getEventInviteesController";
import { MarkAttendanceManager } from "@/app/events/controllers/markAttendanceController";
import useGetSearchForTablesAndGuestsManager from "@/app/events/controllers/tables/getSearchForTablesAndGuestsController";
import useGetAccessCodeDetailsManager from "@/app/events/controllers/members/getAccessCodeInformationController";
import QRCodeScanner from "@/components/events/publicComponents/QRCodeScanner";
import CompletePagination from "@/components/CompletePagination";
import PublicGuestDetailsModal from "@/components/events/publicComponents/PublicGuestDetailsModal";

const AttendanceMarking = () => {
  const searchParams = useSearchParams();
  const accessCode = searchParams.get("c");
  const [currentPage, setCurrentPage] = useState(1);

  // Get event details via access code
  const { isLoading: loadingEventData, data: accessCodeData } =
    useGetAccessCodeDetailsManager({ code: accessCode });

  // State management
  const [event, setEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [scanMode, setScanMode] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null); // Track selected guest
  const [showGuestDetails, setShowGuestDetails] = useState(false); // Control guest details modal

  // Attendance marking hook
  const { markAttendance, isLoading: markingAttendance } =
    MarkAttendanceManager();

  // Get guests list
  const { data: guestsData, isLoading: loadingGuests } =
    useGetEventInviteesManager({
      eventId: event?.id || event?._id,
      page: currentPage,
      code: accessCode,
      enabled: Boolean(event?.id || event?._id),
    });

  // Search functionality
  const { data: searchResult, isLoading: loadingSearch } =
    useGetSearchForTablesAndGuestsManager({
      eventId: event?.id || event?._id,
      enabled: Boolean(debouncedQuery.length > 0 && (event?.id || event?._id)),
      searchQuery: debouncedQuery,
      code: accessCode,
    });

  // Set event data when it loads
  useEffect(() => {
    if (accessCodeData && accessCodeData.data) {
      setEvent(accessCodeData.data.event);
    }
  }, [accessCodeData]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle QR code scan
  const handleScan = (code) => {
    setSearchQuery(code); // Automatically populate search input

    // Find the guest with this code
    const guests = guestsData?.data || [];
    const guest = guests.find((g) => g.code === code);

    if (guest) {
      markGuestAttendance(guest);
      setSuccessMessage({
        type: "success",
        text: `Guest ${guest.name} marked as attended.`,
      });
    } else {
      setSuccessMessage({ type: "warning", text: "Searching for guest..." });
      setTimeout(() => {
        if (searchResult?.data?.guests?.length > 0) {
          const foundGuest = searchResult.data.guests.find(
            (g) => g.code === code
          );
          if (foundGuest) {
            markGuestAttendance(foundGuest);
          } else {
            setSuccessMessage({
              type: "error",
              text: "No guest found with this code.",
            });
          }
        }
      }, 1500);
    }
  };

  // Mark guest attendance
  const markGuestAttendance = async (guest) => {
    if (!guest || (!guest.id && !guest._id)) {
      setSuccessMessage({
        type: "error",
        text: "Invalid guest data. Please try again.",
      });
      return;
    }

    try {
      await markAttendance({
        inviteeId: guest.id || guest._id,
        code: accessCode,
      });
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error marking attendance:", error);
      setSuccessMessage({
        type: "error",
        text: "Failed to mark attendance. Please try again.",
      });
    }
  };

  // Show guest details
  const handleShowGuestDetails = (guest) => {
    setSelectedGuest(guest);
    setShowGuestDetails(true);
  };

  // Close guest details
  const handleCloseGuestDetails = () => {
    setShowGuestDetails(false);
    setSelectedGuest(null);
  };

  // Loading skeleton
  if (loadingEventData || !event) {
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

  const filteredGuests =
    debouncedQuery && searchResult?.data?.guests
      ? searchResult.data.guests
      : guestsData?.data || [];
  const totalGuests = guestsData?.pagination?.total || 0;
  const attendedGuests =
    guestsData?.data?.filter((g) => g.attended).length || 0;

  return (
    <div className="max-w-4xl mx-auto p-4">
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="p-3 bg-blue-100 rounded-full">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Total Guests</p>
            <p className="text-xl font-semibold">{totalGuests}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="p-3 bg-green-100 rounded-full">
            <UserCheck className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Attended</p>
            <p className="text-xl font-semibold">{attendedGuests}</p>
          </div>
        </div>
      </div>

      {/* Search and QR Scanner */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="Search by name, phone, or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        <button
          onClick={() => setScanMode(!scanMode)}
          className={`flex items-center justify-center px-4 py-2 border font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            scanMode
              ? "bg-red-600 hover:bg-red-700"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          <QrCode className="mr-2 h-4 w-4" />
          {scanMode ? "Cancel Scanning" : "Scan QR Code"}
        </button>
      </div>

      {/* QR Scanner */}
      {scanMode && (
        <QRCodeScanner
          onScan={handleScan}
          scanMode={scanMode}
          setScanMode={setScanMode}
        />
      )}

      {/* Success Message */}
      {successMessage && (
        <div
          className={`mb-6 px-4 py-3 rounded relative flex items-start ${
            successMessage.type === "success"
              ? "bg-green-100 border border-green-400 text-green-700"
              : successMessage.type === "error"
              ? "bg-red-100 border border-red-400 text-red-700"
              : "bg-yellow-100 border border-yellow-400 text-yellow-700"
          }`}
        >
          {successMessage.type === "success" ? (
            <Check className="h-5 w-5 mr-2 flex-shrink-0" />
          ) : (
            <X className="h-5 w-5 mr-2 flex-shrink-0" />
          )}
          <span>{successMessage.text}</span>
        </div>
      )}

      {/* Guest List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-lg font-medium">Attendance List</h2>
        </div>
        {loadingGuests || loadingSearch ? (
          <div className="p-6 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading guests...</p>
          </div>
        ) : filteredGuests.length === 0 ? (
          <div className="p-6 text-center text-gray-500 italic">
            No guests found matching your search.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredGuests.map((guest) => (
              <li
                key={guest.id || guest._id}
                className="px-6 py-4 hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                      <p
                        className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-purple-600"
                        onClick={() => handleShowGuestDetails(guest)}
                      >
                        {guest.name}
                      </p>
                      <span
                        className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                          guest.response === "accepted"
                            ? "bg-green-100 text-green-800"
                            : guest.response === "declined"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {guest.response === "accepted"
                          ? "Accepted"
                          : guest.response === "declined"
                          ? "Declined"
                          : "Pending"}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        {guest.phone}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        {guest.email || "No email"}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <span className="font-mono bg-gray-100 px-1 rounded">
                          {guest.code}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShowGuestDetails(guest)}
                      className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => markGuestAttendance(guest)}
                      disabled={guest.attended || markingAttendance}
                      className={`inline-flex items-center px-3 py-1 border font-medium rounded-md text-sm ${
                        guest.attended
                          ? "border-green-500 text-green-700 bg-green-50"
                          : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                      }`}
                    >
                      {guest.attended ? (
                        <>
                          <UserCheck className="mr-1.5 h-4 w-4 text-green-500" />
                          Present
                        </>
                      ) : (
                        "Mark Present"
                      )}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Guest Details Modal */}
      {showGuestDetails && selectedGuest && (
        <PublicGuestDetailsModal
          isOpen={showGuestDetails}
          onClose={handleCloseGuestDetails}
          selectedGuest={selectedGuest}
          markGuestAttendance={markGuestAttendance}
          markingAttendance={markingAttendance}
        />
      )}

      {/* Pagination */}
      {guestsData?.data?.length > 0 && guestsData?.pagination && (
        <CompletePagination
          setCurrentPage={setCurrentPage}
          pagination={guestsData?.pagination}
          suffix="Tables"
        />
      )}
    </div>
  );
};

export default AttendanceMarking;
