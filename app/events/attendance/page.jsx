"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  UserCheck,
  Users,
  X,
  QrCode,
  Check,
  AlertCircle,
} from "lucide-react";

const AttendanceMarking = ({ accessCode, eventId }) => {
  const [event, setEvent] = useState(null);
  const [guests, setGuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [scanMode, setScanMode] = useState(false);
  const [scannedCode, setScannedCode] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [showGuestDetails, setShowGuestDetails] = useState(false);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

  // Mock event data for demonstration
  useEffect(() => {
    // In a real app, this would be a fetch request using the accessCode
    setTimeout(() => {
      setEvent({
        id: "event123",
        title: "Annual Company Gala",
        date: "2025-03-30T18:00:00Z",
        location: "Grand Ballroom, Hilton Hotel",
        totalGuests: 120,
        attendedGuests: 3,
      });

      setGuests([
        {
          id: "g1",
          name: "John Smith",
          phone: "+1234567890",
          email: "john@example.com",
          status: "Accepted",
          attendance: true,
          qrCode: "QR-JOHN-1234",
          inviteCode: "INV-9876543",
          tableId: "t1",
          tableName: "Table A",
          photoUrl: "/api/placeholder/100/100", // In a real app, this would be a profile photo
          dietaryRequirements: "Vegetarian",
          notes: "VIP guest, CEO of partner company",
        },
        {
          id: "g2",
          name: "Sarah Johnson",
          phone: "+1987654321",
          email: "sarah@example.com",
          status: "Accepted",
          attendance: false,
          qrCode: "QR-SARAH-5678",
          inviteCode: "INV-8765432",
          tableId: "t2",
          tableName: "Table B",
          photoUrl: "/api/placeholder/100/100",
          dietaryRequirements: "No restrictions",
          notes: "",
        },
        {
          id: "g3",
          name: "Michael Brown",
          phone: "+1456789123",
          email: "michael@example.com",
          status: "Accepted",
          attendance: true,
          qrCode: "QR-MICHAEL-9012",
          inviteCode: "INV-7654321",
          tableId: "t1",
          tableName: "Table A",
          photoUrl: "/api/placeholder/100/100",
          dietaryRequirements: "Gluten-free",
          notes: "Arriving 30 minutes late",
        },
        {
          id: "g4",
          name: "Emma Wilson",
          phone: "+1321654987",
          email: "emma@example.com",
          status: "Accepted",
          attendance: true,
          qrCode: "QR-EMMA-3456",
          inviteCode: "INV-6543210",
          tableId: "t3",
          tableName: "Table C",
          photoUrl: "/api/placeholder/100/100",
          dietaryRequirements: "Nut allergy",
          notes: "",
        },
        {
          id: "g5",
          name: "David Lee",
          phone: "+1789123456",
          email: "david@example.com",
          status: "Accepted",
          attendance: false,
          qrCode: "QR-DAVID-7890",
          inviteCode: "INV-5432109",
          tableId: "t2",
          tableName: "Table B",
          photoUrl: "/api/placeholder/100/100",
          dietaryRequirements: "No restrictions",
          notes: "Plus one confirmed",
        },
        {
          id: "g6",
          name: "Jennifer Garcia",
          phone: "+1654321987",
          email: "jennifer@example.com",
          status: "Pending",
          attendance: false,
          qrCode: "QR-JENNIFER-2345",
          inviteCode: "INV-4321098",
          tableId: "",
          tableName: "",
          photoUrl: "/api/placeholder/100/100",
          dietaryRequirements: "Vegan",
          notes: "Waiting for RSVP confirmation",
        },
        {
          id: "g7",
          name: "Robert Martinez",
          phone: "+1123789456",
          email: "robert@example.com",
          status: "Accepted",
          attendance: false,
          qrCode: "QR-ROBERT-6789",
          inviteCode: "INV-3210987",
          tableId: "t3",
          tableName: "Table C",
          photoUrl: "/api/placeholder/100/100",
          dietaryRequirements: "No restrictions",
          notes: "",
        },
      ]);

      setIsLoading(false);
    }, 1500);

    // Clean up QR scanner if active
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
      }
    };
  }, []);

  // Filter guests based on search query
  const filteredGuests = guests.filter(
    (guest) =>
      guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.phone.includes(searchQuery) ||
      guest.qrCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guest.inviteCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to toggle attendance status
  const toggleAttendance = (guestId) => {
    setGuests(
      guests.map((guest) => {
        if (guest.id === guestId) {
          // Show success message if marking attendance
          if (!guest.attendance) {
            setSuccessMessage(`${guest.name} marked as attended!`);
            setTimeout(() => setSuccessMessage(null), 3000);
          }

          return {
            ...guest,
            attendance: !guest.attendance,
          };
        }
        return guest;
      })
    );
  };

  // Function to show guest details
  const handleShowGuestDetails = (guest) => {
    setSelectedGuest(guest);
    setShowGuestDetails(true);
  };

  // Function to close guest details
  const handleCloseGuestDetails = () => {
    setShowGuestDetails(false);
    setSelectedGuest(null);
  };

  // Function to toggle QR code scanning mode
  const toggleScanMode = () => {
    if (scanMode) {
      // Stop scanning
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current = null;
      }
      setScanMode(false);
    } else {
      setScanMode(true);
      // In a real app, we would initialize QR scanner library here
      // For this demo, we'll use a mock implementation

      // Mock QR scan after 3 seconds
      setTimeout(() => {
        // Simulate finding a guest
        const randomGuest = guests.find((g) => !g.attendance);
        if (randomGuest) {
          setScannedCode(randomGuest.qrCode);

          // Automatically mark attendance
          toggleAttendance(randomGuest.id);

          // Reset after showing the result
          setTimeout(() => {
            setScannedCode(null);
          }, 5000);
        }
      }, 3000);
    }
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
    <div className="max-w-4xl mx-auto p-4">
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
          <div className="p-3 bg-green-100 rounded-full">
            <UserCheck className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm text-gray-500">Attended</p>
            <p className="text-xl font-semibold">
              {guests.filter((g) => g.attendance).length}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Mode Toggle */}
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
            disabled={scanMode}
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
          onClick={toggleScanMode}
          className={`flex items-center justify-center px-4 py-2 border font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            scanMode
              ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
              : "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
          }`}
        >
          <QrCode className="mr-2 h-4 w-4" />
          {scanMode ? "Cancel Scanning" : "Scan QR Code"}
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <Check className="inline-block mr-2 h-5 w-5" />
          {successMessage}
        </div>
      )}

      {/* QR Scanner View */}
      {scanMode && (
        <div className="mb-6">
          <div className="bg-black relative overflow-hidden rounded-lg aspect-video">
            {/* This would be a real video feed in a production app */}
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              {scannedCode ? (
                <div className="text-center p-6 bg-white rounded-lg max-w-xs">
                  <div className="text-green-600 mb-2">
                    <Check className="h-12 w-12 mx-auto" />
                  </div>
                  <p className="text-xl font-bold mb-2">QR Code Detected</p>
                  <p className="text-gray-600 font-mono text-sm mb-2">
                    {scannedCode}
                  </p>
                  <p className="text-green-600 font-medium">
                    Attendance marked successfully!
                  </p>
                </div>
              ) : (
                <>
                  <div className="text-white text-lg animate-pulse">
                    Scanning QR Code...
                  </div>
                  {/* QR Scan frame overlay */}
                  <div className="absolute border-2 border-purple-500 w-1/2 h-1/2 rounded-lg"></div>
                </>
              )}
            </div>
            <video
              ref={videoRef}
              className="w-full h-full object-cover opacity-50"
              playsInline
              muted
            />
          </div>
          <p className="text-center text-sm text-gray-600">
            Position the QR code within the frame to scan
          </p>
        </div>
      )}

      {/* Guest List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-lg font-medium">Attendance List</h2>
        </div>

        {filteredGuests.length === 0 ? (
          <div className="p-6 text-center text-gray-500 italic">
            No guests found matching your search.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredGuests.map((guest) => (
              <li key={guest.id} className="px-6 py-4 hover:bg-gray-50">
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
                    <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        {guest.phone}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        {guest.email}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <span className="font-mono bg-gray-100 px-1 rounded">
                          {guest.inviteCode}
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
                      onClick={() => toggleAttendance(guest.id)}
                      className={`inline-flex items-center px-3 py-1 border font-medium rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        guest.attendance
                          ? "border-green-500 text-green-700 bg-green-50 hover:bg-green-100 focus:ring-green-500"
                          : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-purple-500"
                      }`}
                    >
                      {guest.attendance ? (
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-medium">Guest Details</h2>
              <button
                onClick={handleCloseGuestDetails}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Photo and basic info */}
                <div className="md:w-1/3">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                    <img
                      src={selectedGuest.photoUrl}
                      alt={selectedGuest.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-gray-500">Invite Code</p>
                      <p className="text-base font-mono bg-gray-100 px-2 py-1 rounded">
                        {selectedGuest.inviteCode}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">QR Code</p>
                      <p className="text-base font-mono bg-gray-100 px-2 py-1 rounded">
                        {selectedGuest.qrCode}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Table Assignment</p>
                      <p className="text-base">
                        {selectedGuest.tableName || "Not assigned"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Detailed information */}
                <div className="md:w-2/3">
                  <h3 className="text-xl font-bold mb-2">
                    {selectedGuest.name}
                  </h3>

                  <div className="grid grid-cols-1 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <div className="flex items-center">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            selectedGuest.status === "Accepted"
                              ? "bg-green-100 text-green-800"
                              : selectedGuest.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedGuest.status}
                        </span>

                        <span
                          className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                            selectedGuest.attendance
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {selectedGuest.attendance
                            ? "Present"
                            : "Not Checked In"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Contact Information
                      </p>
                      <p className="text-base">{selectedGuest.phone}</p>
                      <p className="text-base">{selectedGuest.email}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Dietary Requirements
                      </p>
                      <p className="text-base">
                        {selectedGuest.dietaryRequirements || "None specified"}
                      </p>
                    </div>

                    {selectedGuest.notes && (
                      <div>
                        <p className="text-sm text-gray-500">Notes</p>
                        <p className="text-base">{selectedGuest.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        toggleAttendance(selectedGuest.id);
                        handleCloseGuestDetails();
                      }}
                      className={`inline-flex items-center px-4 py-2 border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                        selectedGuest.attendance
                          ? "border-red-500 text-red-700 bg-red-50 hover:bg-red-100 focus:ring-red-500"
                          : "border-green-500 text-green-700 bg-green-50 hover:bg-green-100 focus:ring-green-500"
                      }`}
                    >
                      {selectedGuest.attendance
                        ? "Mark As Not Present"
                        : "Mark As Present"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer with access info */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border text-center">
        <p className="text-sm text-gray-500">
          You're using the event attendance marking system.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Access Code: {accessCode || "ATT-XXXX-XXX"}
        </p>
      </div>
    </div>
  );
};

export default AttendanceMarking;
