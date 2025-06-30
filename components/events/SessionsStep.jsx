import React, { useState } from "react";
import InputWithFullBoarder from "../InputWithFullBoarder";
import { Plus, Calendar, Clock, MapPin, Trash2, Users } from "lucide-react";

export const SessionsStep = ({ formData, onFormDataChange }) => {
  const [showAddSession, setShowAddSession] = useState(false);
  const [newSession, setNewSession] = useState({
    name: "",
    date: "",
    start_time: "",
    end_time: "",
    description: "",
    location: "",
    is_attendance_required: true,
  });

  const sessions = formData.sessions || [];

  const handleAddSession = () => {
    if (!newSession.name || !newSession.date || !newSession.start_time) {
      alert(
        "Please fill in required fields: Session name, date, and start time"
      );
      return;
    }

    const sessionToAdd = {
      id: `session_${Date.now()}`,
      ...newSession,
    };

    const updatedSessions = [...sessions, sessionToAdd];
    onFormDataChange("sessions", updatedSessions);

    // Reset form
    setNewSession({
      name: "",
      date: "",
      start_time: "",
      end_time: "",
      description: "",
      location: "",
      is_attendance_required: true,
    });
    setShowAddSession(false);
  };

  const handleRemoveSession = (sessionId) => {
    const updatedSessions = sessions.filter(
      (session) => session.id !== sessionId
    );
    onFormDataChange("sessions", updatedSessions);
  };

  const handleSessionChange = (sessionId, field, value) => {
    const updatedSessions = sessions.map((session) =>
      session.id === sessionId ? { ...session, [field]: value } : session
    );
    onFormDataChange("sessions", updatedSessions);
  };

  const getEventDates = () => {
    const dates = [];
    if (formData.date) {
      dates.push(formData.date);
    }
    if (formData.is_multi_day && formData.end_date) {
      const startDate = new Date(formData.date);
      const endDate = new Date(formData.end_date);
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    return [...new Set(dates)]; // Remove duplicates
  };

  const availableDates = getEventDates();

  return (
    <div className="flex flex-col w-full text-brandBlack">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Event Sessions</h2>
        <p className="text-gray-600">
          Create sessions to track attendance for different parts of your event.
          Sessions are useful for multi-day events or events with multiple
          activities.
        </p>
      </div>

      {/* Enable Sessions Toggle */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            id="enable_sessions"
            checked={formData.enable_sessions || false}
            onChange={(e) =>
              onFormDataChange("enable_sessions", e.target.checked)
            }
            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          />
          <label
            htmlFor="enable_sessions"
            className="font-medium text-gray-700"
          >
            Enable session-based attendance tracking
          </label>
        </div>
        <p className="text-sm text-gray-600">
          When enabled, attendees will check in to specific sessions rather than
          the entire event.
        </p>
      </div>

      {formData.enable_sessions && (
        <>
          {/* Existing Sessions */}
          <div className="space-y-4 mb-6">
            {sessions.map((session, index) => (
              <div key={session.id} className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg">{session.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(session.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {session.start_time}{" "}
                        {session.end_time && `- ${session.end_time}`}
                      </div>
                      {session.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {session.location}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {session.is_attendance_required
                          ? "Required"
                          : "Optional"}
                      </div>
                    </div>
                    {session.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {session.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveSession(session.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Quick Edit Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                  <InputWithFullBoarder
                    label="Session Name"
                    value={session.name}
                    onChange={(e) =>
                      handleSessionChange(session.id, "name", e.target.value)
                    }
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <select
                      value={session.date}
                      onChange={(e) =>
                        handleSessionChange(session.id, "date", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    >
                      {availableDates.map((date) => (
                        <option key={date} value={date}>
                          {new Date(date).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={session.is_attendance_required}
                      onChange={(e) =>
                        handleSessionChange(
                          session.id,
                          "is_attendance_required",
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <label className="text-sm text-gray-700">
                      Required attendance
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Session Button */}
          {!showAddSession && (
            <button
              onClick={() => setShowAddSession(true)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Session
            </button>
          )}

          {/* Add Session Form */}
          {showAddSession && (
            <div className="border-2 border-purple-200 rounded-lg p-6 bg-purple-50">
              <h3 className="font-medium text-lg mb-4">Add New Session</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <InputWithFullBoarder
                  label="Session Name *"
                  value={newSession.name}
                  onChange={(e) =>
                    setNewSession({ ...newSession, name: e.target.value })
                  }
                  placeholder="e.g., Opening Ceremony"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <select
                    value={newSession.date}
                    onChange={(e) =>
                      setNewSession({ ...newSession, date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="">Select Date</option>
                    {availableDates.map((date) => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <InputWithFullBoarder
                  label="Start Time *"
                  type="time"
                  value={newSession.start_time}
                  onChange={(e) =>
                    setNewSession({ ...newSession, start_time: e.target.value })
                  }
                />

                <InputWithFullBoarder
                  label="End Time"
                  type="time"
                  value={newSession.end_time}
                  onChange={(e) =>
                    setNewSession({ ...newSession, end_time: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <InputWithFullBoarder
                  label="Location"
                  value={newSession.location}
                  onChange={(e) =>
                    setNewSession({ ...newSession, location: e.target.value })
                  }
                  placeholder="Optional - defaults to main venue"
                />

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    checked={newSession.is_attendance_required}
                    onChange={(e) =>
                      setNewSession({
                        ...newSession,
                        is_attendance_required: e.target.checked,
                      })
                    }
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-700">
                    Required attendance
                  </label>
                </div>
              </div>

              <InputWithFullBoarder
                label="Description"
                isTextArea={true}
                rows={3}
                value={newSession.description}
                onChange={(e) =>
                  setNewSession({ ...newSession, description: e.target.value })
                }
                placeholder="Brief description of this session"
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddSession}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  Add Session
                </button>
                <button
                  onClick={() => setShowAddSession(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {sessions.length === 0 && !showAddSession && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>
                No sessions added yet. Click "Add Session" to create your first
                session.
              </p>
            </div>
          )}
        </>
      )}

      {!formData.enable_sessions && (
        <div className="text-center py-8 text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>
            Session-based attendance is disabled. Attendees will check in to the
            entire event.
          </p>
        </div>
      )}
    </div>
  );
};
