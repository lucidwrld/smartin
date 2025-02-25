"use client";

import React, { useState, useEffect } from "react";
import { Search, Users, UserCheck, X, Clock, Grid } from "lucide-react";

const PublicEventView = ({ accessCode, eventId }) => {
  const [event, setEvent] = useState(null);
  const [guests, setGuests] = useState([]);
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("guests"); // "guests" or "tables"

  // Mock event data for demonstration
  useEffect(() => {
    // In a real app, this would be a fetch request using the accessCode
    setTimeout(() => {
      setEvent({
        id: "event123",
        title: "Annual Company Gala",
        date: "2025-03-30T18:00:00Z",
        location: "Grand Ballroom, Hilton Hotel",
        description: "Join us for our annual company celebration",
        totalGuests: 120,
        attendedGuests: 0,
        pendingGuests: 120,
      });

      setGuests([
        {
          id: "g1",
          name: "John Smith",
          phone: "+1234567890",
          email: "john@example.com",
          status: "Accepted",
          attendance: false,
          tableId: "t1",
        },
        {
          id: "g2",
          name: "Sarah Johnson",
          phone: "+1987654321",
          email: "sarah@example.com",
          status: "Pending",
          attendance: false,
          tableId: "t2",
        },
        {
          id: "g3",
          name: "Michael Brown",
          phone: "+1456789123",
          email: "michael@example.com",
          status: "Declined",
          attendance: false,
          tableId: null,
        },
        {
          id: "g4",
          name: "Emma Wilson",
          phone: "+1321654987",
          email: "emma@example.com",
          status: "Accepted",
          attendance: false,
          tableId: "t1",
        },
        {
          id: "g5",
          name: "David Lee",
          phone: "+1789123456",
          email: "david@example.com",
          status: "Accepted",
          attendance: false,
          tableId: "t2",
        },
      ]);

      setTables([
        {
          id: "t1",
          name: "Table A",
          capacity: 8,
          assignedGuests: ["g1", "g4"],
        },
        {
          id: "t2",
          name: "Table B",
          capacity: 8,
          assignedGuests: ["g2", "g5"],
        },
        { id: "t3", name: "Table C", capacity: 6, assignedGuests: [] },
      ]);

      setIsLoading(false);
    }, 1500);
  }, []);

  // Filter guests based on search query
  const filteredGuests = guests.filter(
    (guest) =>
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.phone.includes(searchQuery)
  );

  // Filter tables based on search query
  const filteredTables = tables.filter(
    (table) =>
      table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guests
        .filter((g) => table.assignedGuests.includes(g.id))
        .some((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Get guest details for a table
  const getTableGuests = (tableId) => {
    return guests.filter((guest) => guest.tableId === tableId);
  };

  // Loading skeleton
  if (isLoading) {
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

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Event Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{event.title}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center mt-2 text-gray-600">
          <div className="mr-4">
            <span className="font-medium">Date:</span>{" "}
            {new Date(event.date).toLocaleString()}
          </div>
          <div>
            <span className="font-medium">Location:</span> {event.location}
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
            <p className="text-xl font-semibold">{event.totalGuests}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="p-3 bg-yellow-100 rounded-full">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-xl font-semibold">{event.pendingGuests}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow flex items-center">
          <div className="p-3 bg-green-100 rounded-full">
            <UserCheck className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Attended</p>
            <p className="text-xl font-semibold">{event.attendedGuests}</p>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div className="mb-6 relative">
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
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

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
      {activeTab === "guests" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contact
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Table
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No guests found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((guest) => {
                    const table = tables.find((t) => t.id === guest.tableId);

                    return (
                      <tr key={guest.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {guest.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {guest.phone}
                          </div>
                          <div className="text-sm text-gray-500">
                            {guest.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              guest.status === "Accepted"
                                ? "bg-green-100 text-green-800"
                                : guest.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {guest.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {table ? table.name : "-"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tables Tab */}
      {activeTab === "tables" && (
        <div className="space-y-6">
          {filteredTables.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
              No tables found matching your search.
            </div>
          ) : (
            filteredTables.map((table) => {
              const tableGuests = guests.filter((g) =>
                table.assignedGuests.includes(g.id)
              );

              return (
                <div
                  key={table.id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  <div className="px-6 py-4 border-b bg-gray-50">
                    <h3 className="text-lg font-medium">{table.name}</h3>
                    <p className="text-sm text-gray-500">
                      {tableGuests.length} of {table.capacity} seats filled
                    </p>
                  </div>

                  {tableGuests.length === 0 ? (
                    <div className="p-6 text-center text-gray-500 italic">
                      No guests assigned to this table yet.
                    </div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {tableGuests.map((guest) => (
                        <li key={guest.id} className="px-6 py-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {guest.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {guest.phone}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                guest.status === "Accepted"
                                  ? "bg-green-100 text-green-800"
                                  : guest.status === "Pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {guest.status}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })
          )}
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
