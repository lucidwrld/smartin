"use client";

import React, { useState, useEffect } from "react";
import {
  Copy,
  PlusCircle,
  Trash,
  Mail,
  Lock,
  Eye,
  CheckCheck,
  UserX,
  Share2,
  Link,
} from "lucide-react";
import useGetMembersManager from "@/app/events/controllers/members/getMembersController";
import { AddMemberManager } from "@/app/events/controllers/members/addMembersController";
import { RemoveMemberManager } from "@/app/events/controllers/members/removeMemberController";
import { UpdateMemberPermissionManager } from "@/app/events/controllers/members/editMemberPermissionController";
import useGetEventAccessCodesManager from "@/app/events/controllers/members/getEventAccessCodesController";
import { ChangeAccessCodeManager } from "@/app/events/controllers/members/changeEventAccessCodeController";
import { copyToClipboard } from "@/utils/copyToClipboard";
import { formatDate } from "@/utils/formatDate";
import CustomButton from "@/components/Button";

const AccessManagement = ({ event }) => {
  const [selectedMember, setSelectedMember] = useState(null);

  // Fetch members data
  const { data, isLoading, refetch } = useGetMembersManager({
    eventId: event?.id,
  });

  const { data: accessCodeData, isLoading: loading } =
    useGetEventAccessCodesManager({ eventId: event?.id });
  const accessCodes = accessCodeData?.data || [];
  const { changeAccessCode, isLoading: changing } = ChangeAccessCodeManager({
    eventId: event?.id,
  });

  // Add member hook
  const { addMember, isLoading: adding } = AddMemberManager({
    eventId: event?.id,
  });

  // Remove member hook
  const { removeMember, isLoading: removing } = RemoveMemberManager({
    eventId: event?.id,
    memberId: selectedMember,
  });

  // Update member permissions hook
  const { updateMember, isLoading: updating } = UpdateMemberPermissionManager({
    eventId: event?.id,
    memberId: selectedMember,
  });

  const users = data?.data || [];

  // State for new users
  const [newUserEmails, setNewUserEmails] = useState("");
  const [newUserPermissions, setNewUserPermissions] = useState({
    edit_event: false,
    add_guest: false,
    send_notification: false,
    manage_table: false,
    mark_attendance: false,
    view_only: true,
    edit_thankyou: false,
  });

  // State for active tab
  const [activeTab, setActiveTab] = useState("users");

  // Refresh data after operations
  useEffect(() => {
    if (!adding && !removing && !updating) {
      refetch();
    }
  }, [adding, removing, updating, refetch]);

  // Function to add new users
  const handleAddUsers = async () => {
    if (!newUserEmails) {
      alert("Please enter at least one email address");
      return;
    }

    // Split by commas, semicolons, or newlines and trim each email
    const emailList = newUserEmails
      .split(/[,;\n]/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0);

    // Validate emails
    const invalidEmails = emailList.filter((email) => !email.includes("@"));
    if (invalidEmails.length > 0) {
      alert(
        `Please correct these invalid email addresses: ${invalidEmails.join(
          ", "
        )}`
      );
      return;
    }

    // Check for existing emails
    const existingEmails = emailList.filter((email) =>
      users.some((user) => user.email === email)
    );
    if (existingEmails.length > 0) {
      alert(`These emails already have access: ${existingEmails.join(", ")}`);
      return;
    }

    // Create members array with all emails using the same permissions
    const members = emailList.map((email) => ({
      email,
      permissions: newUserPermissions,
    }));

    const detailsToSubmit = { members };

    try {
      await addMember(detailsToSubmit);

      setNewUserEmails("");
      setNewUserPermissions({
        edit_event: false,
        add_guest: false,
        send_notification: false,
        manage_table: false,
        mark_attendance: false,
        view_only: true,
        edit_thankyou: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Function to remove user
  const handleRemoveUser = async (email, memberId) => {
    try {
      await removeMember();
    } catch (error) {}
  };

  // Function to update user permissions
  const handleUpdatePermissions = async (
    email,
    permission,
    value,
    memberId
  ) => {
    try {
      setSelectedMember(memberId);

      // Get the current user's permissions
      const currentUser = users.find((user) => user.email === email);
      if (!currentUser) return;

      // Create updated permissions object
      const updatedPermissions = {
        ...currentUser.permissions,
        [permission]: value,
      };

      // Prepare data for API
      const details = {
        email: email,
        permissions: updatedPermissions,
      };

      await updateMember(details);
    } catch (error) {}
  };

  // Function to bulk update permissions
  const handleBulkPermissionUpdate = async (
    email,
    newPermissions,
    memberId
  ) => {
    try {
      setSelectedMember(memberId);

      // Get the current user's permissions
      const currentUser = users.find((user) => user.email === email);
      if (!currentUser) return;

      // Create updated permissions object by merging
      const updatedPermissions = {
        ...currentUser.permissions,
        ...newPermissions,
      };

      // Prepare data for API
      const details = {
        email: email,
        permissions: updatedPermissions,
      };

      await updateMember(details);
    } catch (error) {}
  };

  // Function to generate access code
  const handleGenerateCode = async (type) => {
    const dataToSend =
      type === "view"
        ? {
            mark_attendance: false,
            view_only: true,
          }
        : {
            mark_attendance: true,
            view_only: false,
          };
    await changeAccessCode(dataToSend);
  };

  // Function to copy access code
  const handleCopyCode = (code) => {
    copyToClipboard(code);
  };

  // Function to copy link with access code
  const handleCopyLink = (code, type) => {
    const baseUrl = window.location.origin;
    const url = type === "view" 
      ? `${baseUrl}/events/${event?.id}/guests?accessCode=${code}`
      : `${baseUrl}/events/${event?.id}/attendance?accessCode=${code}`;
    copyToClipboard(url);
  };

  // Function to share link
  const handleShare = async (code, type) => {
    const baseUrl = window.location.origin;
    const url = type === "view" 
      ? `${baseUrl}/events/${event?.id}/guests?accessCode=${code}`
      : `${baseUrl}/events/${event?.id}/attendance?accessCode=${code}`;
    
    const shareData = {
      title: `${event?.eventName} - ${type === "view" ? "Guest List" : "Mark Attendance"}`,
      text: `Access code: ${code}`,
      url: url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to copying the link
        copyToClipboard(url);
      }
    } catch (err) {
      console.log("Error sharing:", err);
    }
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
                    Email address(es)
                  </label>
                  <textarea
                    id="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter emails separated by commas, semicolons, or new lines (e.g., user1@example.com, user2@example.com)"
                    value={newUserEmails}
                    onChange={(e) => setNewUserEmails(e.target.value)}
                    rows={3}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    You can enter multiple email addresses separated by commas,
                    semicolons, or new lines.
                  </p>
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
                          {key.replace(/_/g, " ")}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleAddUsers}
                  disabled={adding}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300"
                >
                  {adding ? (
                    "Adding..."
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Grant Access
                    </>
                  )}
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Current access</h3>
              {isLoading ? (
                <p className="text-gray-500">Loading members...</p>
              ) : (
                <div className="space-y-4">
                  {users.length === 0 ? (
                    <p className="text-gray-500 italic">
                      No users have been granted access yet.
                    </p>
                  ) : (
                    users.map((user) => (
                      <div
                        key={user.id || user.email}
                        onMouseEnter={() => setSelectedMember(user.id)}
                        className="border rounded-lg overflow-hidden"
                      >
                        <div className="p-4 bg-gray-50 flex justify-between items-center">
                          <div className="flex items-center">
                            <Mail className="mr-2 h-4 w-4 text-gray-500" />
                            <span className="font-medium">{user.email}</span>
                          </div>
                          <button
                            onMouseEnter={() => setSelectedMember(user.id)}
                            onClick={() => {
                              handleRemoveUser(user.email, user.id);
                            }}
                            disabled={removing && selectedMember === user.id}
                            className="p-1 rounded-full text-red-500 hover:bg-red-50 focus:outline-none disabled:text-red-300"
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
                                onMouseEnter={() => setSelectedMember(user.id)}
                                onClick={() => {
                                  handleBulkPermissionUpdate(
                                    user.email,
                                    {
                                      edit_event: true,
                                      add_guest: true,
                                      send_notification: true,
                                      manage_table: true,
                                      mark_attendance: true,
                                      view_only: false,
                                      edit_thankyou: true,
                                    },
                                    user.id
                                  );
                                }}
                                disabled={
                                  updating && selectedMember === user.id
                                }
                                className="px-2 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 disabled:bg-green-300"
                              >
                                Grant All
                              </button>
                              <button
                                onMouseEnter={() => setSelectedMember(user.id)}
                                onClick={() =>
                                  handleBulkPermissionUpdate(
                                    user.email,
                                    {
                                      edit_event: false,
                                      add_guest: false,
                                      send_notification: false,
                                      manage_table: false,
                                      mark_attendance: false,
                                      view_only: true,
                                      edit_thankyou: false,
                                    },
                                    user.id
                                  )
                                }
                                disabled={
                                  updating && selectedMember === user.id
                                }
                                className="px-2 py-1 text-xs font-medium text-white bg-gray-600 rounded hover:bg-gray-700 disabled:bg-gray-300"
                              >
                                View Only
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {Object.entries(user.permissions || {}).map(
                              ([key, value]) => (
                                <div
                                  key={key}
                                  className="flex items-center space-x-2"
                                >
                                  <input
                                    type="checkbox"
                                    id={`${user.email}-${key}`}
                                    checked={value}
                                    onMouseEnter={() =>
                                      setSelectedMember(user.id)
                                    }
                                    onChange={(e) =>
                                      handleUpdatePermissions(
                                        user.email,
                                        key,
                                        e.target.checked,
                                        user.id
                                      )
                                    }
                                    disabled={
                                      updating && selectedMember === user.id
                                    }
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded disabled:text-purple-300"
                                  />
                                  <label
                                    htmlFor={`${user.email}-${key}`}
                                    className="text-sm text-gray-700 capitalize"
                                  >
                                    {key.replace(/_/g, " ")}
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
              )}
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

                <CustomButton
                  buttonText={"Generate View Code"}
                  onClick={() => handleGenerateCode("view")}
                  prefixIcon={<Eye className="mr-2 h-4 w-4" />}
                  isLoading={changing}
                  className={"px-4 py-2 rounded-md  "}
                />
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">
                  Generate Attendance Marking Access
                </h3>
                <p className="text-sm text-gray-500 mb-3">
                  Creates a code that allows marking attendance at the event
                  entrance.
                </p>
                <CustomButton
                  buttonText={"Generate Attendance Code"}
                  onClick={() => handleGenerateCode("attendance")}
                  prefixIcon={<CheckCheck className="mr-2 h-4 w-4" />}
                  isLoading={changing}
                  className={"px-4 py-2 rounded-md  "}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Active access codes</h3>
              
              {/* Info Box */}
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Access Pages Information:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li className="flex items-start">
                    <Eye className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>View-Only Access:</strong> Allows viewing the guest list and table arrangements at <code className="bg-blue-100 px-1 rounded">/events/{event?.id}/guests</code></span>
                  </li>
                  <li className="flex items-start">
                    <CheckCheck className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span><strong>Attendance Access:</strong> Allows marking guest attendance at the event entrance at <code className="bg-blue-100 px-1 rounded">/events/{event?.id}/attendance</code></span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                {accessCodes.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No active access codes.
                  </p>
                ) : (
                  accessCodes.map((accessCode, index) => {
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              accessCode?.permissions?.view_only
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {accessCode?.permissions?.view_only
                              ? "View Only"
                              : "Attendance"}
                          </span>
                          <div className="font-mono text-sm">
                            {accessCode.code}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            Last updated: {formatDate(accessCode?.updatedAt)}
                          </span>

                          <div className="flex items-center space-x-1">
                            {/* Copy Code Button */}
                            <button
                              onClick={() => handleCopyCode(accessCode.code)}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                              title="Copy access code"
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy Code
                            </button>

                            {/* Copy Link Button */}
                            <button
                              onClick={() => handleCopyLink(accessCode.code, accessCode?.permissions?.view_only ? "view" : "attendance")}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                              title="Copy link with access code"
                            >
                              <Link className="h-3 w-3 mr-1" />
                              Copy Link
                            </button>

                            {/* Share Button */}
                            <button
                              onClick={() => handleShare(accessCode.code, accessCode?.permissions?.view_only ? "view" : "attendance")}
                              className="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-md transition-colors"
                              title="Share access link"
                            >
                              <Share2 className="h-3 w-3 mr-1" />
                              Share
                            </button>
                          </div>
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
