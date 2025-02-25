"use client";

import React, { useState } from "react";
import {
  Copy,
  PlusCircle,
  Trash,
  Mail,
  Lock,
  Eye,
  CheckCheck,
  UserX,
} from "lucide-react";

const AccessManagement = ({ eventId }) => {
  // State for users with access
  const [users, setUsers] = useState([
    {
      email: "john@example.com",
      permissions: {
        editEvent: true,
        addGuests: true,
        sendNotifications: true,
        manageTable: true,
        markAttendance: true,
        viewOnly: false,
        editThankYou: false,
      },
    },
    {
      email: "alice@example.com",
      permissions: {
        editEvent: false,
        addGuests: true,
        sendNotifications: true,
        manageTable: false,
        markAttendance: true,
        viewOnly: false,
        editThankYou: true,
      },
    },
  ]);

  // State for new user
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPermissions, setNewUserPermissions] = useState({
    editEvent: false,
    addGuests: false,
    sendNotifications: false,
    manageTable: false,
    markAttendance: false,
    viewOnly: true,
    editThankYou: false,
  });

  // State for access codes
  const [accessCodes, setAccessCodes] = useState([
    { code: "EVENT-123-ABC", type: "view", expiresAt: "2025-03-25T10:00:00Z" },
    {
      code: "ATT-456-DEF",
      type: "attendance",
      expiresAt: "2025-03-25T23:59:59Z",
    },
  ]);

  // State for active tab
  const [activeTab, setActiveTab] = useState("users");

  // Function to add new user
  const handleAddUser = () => {
    if (!newUserEmail || !newUserEmail.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    if (users.some((user) => user.email === newUserEmail)) {
      alert("This email already has access");
      return;
    }

    setUsers([
      ...users,
      { email: newUserEmail, permissions: newUserPermissions },
    ]);
    setNewUserEmail("");
    setNewUserPermissions({
      editEvent: false,
      addGuests: false,
      sendNotifications: false,
      manageTable: false,
      markAttendance: false,
      viewOnly: true,
      editThankYou: false,
    });

    alert("Access granted successfully");
  };

  // Function to remove user
  const handleRemoveUser = (email) => {
    setUsers(users.filter((user) => user.email !== email));
  };

  // Function to update user permissions
  const handleUpdatePermissions = (email, permission, value) => {
    setUsers(
      users.map((user) => {
        if (user.email === email) {
          return {
            ...user,
            permissions: {
              ...user.permissions,
              [permission]: value,
            },
          };
        }
        return user;
      })
    );

    // Show success message
    alert(`Permission updated for ${email}`);
  };

  // Function to bulk update permissions
  const handleBulkPermissionUpdate = (email, newPermissions) => {
    setUsers(
      users.map((user) => {
        if (user.email === email) {
          return {
            ...user,
            permissions: {
              ...user.permissions,
              ...newPermissions,
            },
          };
        }
        return user;
      })
    );

    alert(`Permissions updated for ${email}`);
  };

  // Function to generate access code
  const handleGenerateCode = (type) => {
    const randomCode = `${type === "view" ? "VIEW" : "ATT"}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 5)
      .toUpperCase()}`;

    // Set expiry date to 24 hours from now
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24);

    setAccessCodes([
      ...accessCodes,
      {
        code: randomCode,
        type,
        expiresAt: expiryDate.toISOString(),
      },
    ]);

    alert(
      `New ${
        type === "view" ? "view-only" : "attendance"
      } code created successfully`
    );
  };

  // Function to copy access code
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert("Access code copied to clipboard");
  };

  // Function to revoke access code
  const handleRevokeCode = (code) => {
    setAccessCodes(accessCodes.filter((ac) => ac.code !== code));
  };

  return (
    <div className="w-full mx-auto p-4 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Manage Access</h1>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${
              activeTab === "users"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("users")}
          >
            User Access
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${
              activeTab === "codes"
                ? "border-b-2 border-purple-600 text-purple-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("codes")}
          >
            Access Codes
          </button>
        </div>
      </div>

      {/* User Access Tab */}
      {activeTab === "users" && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="flex items-center text-lg font-medium">
              <Mail className="mr-2 h-5 w-5" />
              User-based Access
            </h2>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Add new user</h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="user@example.com"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Permissions</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(newUserPermissions).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`new-${key}`}
                          checked={value}
                          onChange={(e) =>
                            setNewUserPermissions({
                              ...newUserPermissions,
                              [key]: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`new-${key}`}
                          className="text-sm text-gray-700 capitalize"
                        >
                          {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAddUser}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Grant Access
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Current access</h3>
              <div className="space-y-4">
                {users.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No users have been granted access yet.
                  </p>
                ) : (
                  users.map((user, index) => (
                    <div
                      key={index}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="p-4 bg-gray-50 flex justify-between items-center">
                        <div className="flex items-center">
                          <Mail className="mr-2 h-4 w-4 text-gray-500" />
                          <span className="font-medium">{user.email}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveUser(user.email)}
                          className="p-1 rounded-full text-red-500 hover:bg-red-50 focus:outline-none"
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-sm font-medium">Permissions</h4>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleBulkPermissionUpdate(user.email, {
                                  editEvent: true,
                                  addGuests: true,
                                  sendNotifications: true,
                                  manageTable: true,
                                  markAttendance: true,
                                  viewOnly: false,
                                  editThankYou: true,
                                })
                              }
                              className="px-2 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700"
                            >
                              Grant All
                            </button>
                            <button
                              onClick={() =>
                                handleBulkPermissionUpdate(user.email, {
                                  editEvent: false,
                                  addGuests: false,
                                  sendNotifications: false,
                                  manageTable: false,
                                  markAttendance: false,
                                  viewOnly: true,
                                  editThankYou: false,
                                })
                              }
                              className="px-2 py-1 text-xs font-medium text-white bg-gray-600 rounded hover:bg-gray-700"
                            >
                              View Only
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {Object.entries(user.permissions).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="checkbox"
                                  id={`${user.email}-${key}`}
                                  checked={value}
                                  onChange={(e) =>
                                    handleUpdatePermissions(
                                      user.email,
                                      key,
                                      e.target.checked
                                    )
                                  }
                                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                />
                                <label
                                  htmlFor={`${user.email}-${key}`}
                                  className="text-sm text-gray-700 capitalize"
                                >
                                  {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                                </label>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Access Codes Tab */}
      {activeTab === "codes" && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="flex items-center text-lg font-medium">
              <Lock className="mr-2 h-5 w-5" />
              Access Codes
            </h2>
          </div>

          <div className="p-6">
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">
                  Generate View-Only Access
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Creates a code that allows seeing the guest list and table
                  arrangement without editing.
                </p>
                <button
                  onClick={() => handleGenerateCode("view")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Generate View Code
                </button>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">
                  Generate Attendance Marking Access
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Creates a code that allows marking attendance at the event
                  entrance.
                </p>
                <button
                  onClick={() => handleGenerateCode("attendance")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <CheckCheck className="mr-2 h-4 w-4" />
                  Generate Attendance Code
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Active access codes</h3>
              <div className="space-y-3">
                {accessCodes.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No active access codes.
                  </p>
                ) : (
                  accessCodes.map((accessCode, index) => {
                    const expiryDate = new Date(accessCode.expiresAt);
                    const isExpired = expiryDate < new Date();

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              accessCode.type === "view"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {accessCode.type === "view"
                              ? "View Only"
                              : "Attendance"}
                          </span>
                          <div className="font-mono text-sm">
                            {accessCode.code}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {isExpired ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                              Expired
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500">
                              Expires: {expiryDate.toLocaleString()}
                            </span>
                          )}

                          <button
                            onClick={() => handleCopyCode(accessCode.code)}
                            disabled={isExpired}
                            className={`p-1 rounded-full focus:outline-none ${
                              isExpired
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-gray-500 hover:bg-gray-100"
                            }`}
                          >
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copy</span>
                          </button>

                          <button
                            onClick={() => handleRevokeCode(accessCode.code)}
                            className="p-1 rounded-full text-red-500 hover:bg-red-50 focus:outline-none"
                          >
                            <UserX className="h-4 w-4" />
                            <span className="sr-only">Revoke</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessManagement;
