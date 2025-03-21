"use client";

import React from "react";
import { X, UserCheck } from "lucide-react";

const PublicGuestDetailsModal = ({
  isOpen,
  onClose,
  selectedGuest,
  markGuestAttendance,
  markingAttendance,
}) => {
  if (!isOpen || !selectedGuest) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-lg font-medium">Guest Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Photo and basic info */}
            <div className="md:w-1/3">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                {selectedGuest.photo ? (
                  <img
                    src={selectedGuest.photo}
                    alt={selectedGuest.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-24 w-24 flex items-center justify-center rounded-full bg-purple-100 text-purple-600">
                    <span className="text-2xl font-bold">
                      {selectedGuest.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Invite Code</p>
                  <p className="text-base font-mono bg-gray-100 px-2 py-1 rounded">
                    {selectedGuest.code}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Table Assignment</p>
                  <p className="text-base">
                    {selectedGuest.table
                      ? selectedGuest.table.name
                      : "Not assigned"}
                  </p>
                </div>
              </div>
            </div>

            {/* Detailed information */}
            <div className="md:w-2/3">
              <h3 className="text-xl font-bold mb-2">{selectedGuest.name}</h3>

              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex items-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedGuest.response === "accepted"
                          ? "bg-green-100 text-green-800"
                          : selectedGuest.response === "declined"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {selectedGuest.response === "accepted"
                        ? "Accepted"
                        : selectedGuest.response === "declined"
                        ? "Declined"
                        : "Pending"}
                    </span>

                    <span
                      className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                        selectedGuest.attended
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {selectedGuest.attended ? "Present" : "Not Checked In"}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Contact Information</p>
                  <p className="text-base">{selectedGuest.phone}</p>
                  <p className="text-base">
                    {selectedGuest.email || "No email"}
                  </p>
                </div>

                {selectedGuest.dietary_requirements && (
                  <div>
                    <p className="text-sm text-gray-500">
                      Dietary Requirements
                    </p>
                    <p className="text-base">
                      {selectedGuest.dietary_requirements}
                    </p>
                  </div>
                )}

                {selectedGuest.note && (
                  <div>
                    <p className="text-sm text-gray-500">Notes</p>
                    <p className="text-base">{selectedGuest.note}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    markGuestAttendance(selectedGuest);
                    onClose();
                  }}
                  disabled={selectedGuest.attended || markingAttendance}
                  className={`inline-flex items-center px-4 py-2 border font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    selectedGuest.attended
                      ? "border-green-500 text-green-700 bg-green-50 cursor-not-allowed opacity-70"
                      : "border-green-500 text-green-700 bg-green-50 hover:bg-green-100 focus:ring-green-500"
                  }`}
                >
                  {selectedGuest.attended ? (
                    <>
                      <UserCheck className="mr-1.5 h-4 w-4 text-green-500" />
                      Already Marked Present
                    </>
                  ) : (
                    "Mark As Present"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicGuestDetailsModal;
