"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Save,
  X,
  Copy,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Settings,
  UserCheck,
  UserPlus,
  List,
  QrCode
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";

// Import session controllers
import useGetAllSessionsManager from "@/app/events/controllers/sessions/controllers/getAllSessionsController";
import CreateSessionManager from "@/app/events/controllers/sessions/controllers/createSessionController";
import UpdateSessionManager from "@/app/events/controllers/sessions/controllers/updateSessionController";
import DeleteSessionManager from "@/app/events/controllers/sessions/controllers/deleteSessionController";
import SessionAttendanceManager from "@/app/events/controllers/sessions/controllers/sessionAttendanceController";
import useGetSessionRegistrationsManager from "@/app/events/controllers/sessions/controllers/getSessionRegistrationsController";
import useGetSessionAttendanceManager from "@/app/events/controllers/sessions/controllers/getSessionAttendanceController";
import GetEventFormsManager from "@/app/events/controllers/forms/getEventFormsController";

const SessionsManagementTab = ({ event }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [viewingSession, setViewingSession] = useState(null);
  const [activeView, setActiveView] = useState("overview"); // "overview", "registrations", "attendance"
  const [attendanceCode, setAttendanceCode] = useState("");

  // Session controllers
  const { data: sessionsData, isLoading: loadingSessions, refetch: refetchSessions } = useGetAllSessionsManager({
    eventId: event?.id,
    enabled: Boolean(event?.id)
  });

  // Forms controller
  const { data: formsData, isLoading: loadingForms } = GetEventFormsManager({
    eventId: event?.id,
    enabled: Boolean(event?.id)
  });

  const { createSession, isLoading: creating, isSuccess: createSuccess } = CreateSessionManager();
  const { updateSession, isLoading: updating, isSuccess: updateSuccess } = UpdateSessionManager(editingSession?._id);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const { deleteSession, isLoading: deleting, isSuccess: deleteSuccess } = DeleteSessionManager(sessionToDelete?._id);
  
  // Session attendance and registration controllers
  const sessionAttendanceManager = SessionAttendanceManager(viewingSession?._id);
  const { data: registrationsData, isLoading: loadingRegistrations, refetch: refetchRegistrations } = useGetSessionRegistrationsManager({
    sessionId: viewingSession?._id,
    enabled: Boolean(viewingSession?._id && activeView === "registrations")
  });
  const { data: attendanceData, isLoading: loadingAttendance, refetch: refetchAttendance } = useGetSessionAttendanceManager({
    sessionId: viewingSession?._id,
    enabled: Boolean(viewingSession?._id && activeView === "attendance")
  });

  // Get sessions from backend data
  const sessions = sessionsData?.data || [];

  const [formData, setFormData] = useState({
    event: event?.id || "",
    name: "",
    description: "",
    date: "",
    start_time: "",
    end_time: "",
    location: "",
    max_capacity: "",
    is_attendance_required: true,
    is_public: true,
    session_type: "main_event",
    speakers: [""],
    requirements: [""],
    forms: []
  });

  const sessionTypes = [
    { value: "main_event", label: "Main Event" },
    { value: "workshop", label: "Workshop" },
    { value: "networking", label: "Networking" },
    { value: "break", label: "Break/Lunch" },
    { value: "ceremony", label: "Ceremony" },
    { value: "presentation", label: "Presentation" },
    { value: "other", label: "Other" }
  ];

  // Handle success states
  useEffect(() => {
    if (createSuccess) {
      handleCloseModal();
      refetchSessions();
    }
  }, [createSuccess]);

  useEffect(() => {
    if (updateSuccess) {
      handleCloseModal();
      refetchSessions();
    }
  }, [updateSuccess]);

  useEffect(() => {
    if (deleteSuccess) {
      setSessionToDelete(null);
      refetchSessions();
    }
  }, [deleteSuccess]);

  const handleOpenModal = (session = null) => {
    setEditingSession(session);
    
    if (session) {
      setFormData({
        event: event?.id || "",
        name: session.name || "",
        description: session.description || "",
        date: session.date || "",
        start_time: session.start_time || "",
        end_time: session.end_time || "",
        location: session.location || "",
        max_capacity: session.max_capacity || "",
        is_attendance_required: session.is_attendance_required !== undefined ? session.is_attendance_required : true,
        is_public: session.is_public !== undefined ? session.is_public : true,
        session_type: session.session_type || "main_event",
        speakers: session.speakers?.length > 0 ? session.speakers : [""],
        requirements: session.requirements?.length > 0 ? session.requirements : [""],
        forms: session.forms || []
      });
    } else {
      setFormData({
        event: event?.id || "",
        name: "",
        description: "",
        date: "",
        start_time: "",
        end_time: "",
        location: "",
        max_capacity: "",
        is_attendance_required: true,
        is_public: true,
        session_type: "main_event",
        speakers: [""],
        requirements: [""],
        forms: []
      });
    }
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSession(null);
    setFormData({
      event: event?.id || "",
      name: "",
      description: "",
      date: "",
      start_time: "",
      end_time: "",
      location: "",
      max_capacity: "",
      is_attendance_required: true,
      is_public: true,
      session_type: "main_event",
      speakers: [""],
      requirements: [""]
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    const updatedArray = [...formData[field]];
    updatedArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: updatedArray
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const removeArrayItem = (field, index) => {
    const updatedArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      [field]: updatedArray
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.date || !formData.start_time) {
      toast.error("Please enter session name, date, and start time");
      return;
    }

    if (!event?.id) {
      toast.error("Event ID is required");
      return;
    }

    try {
      const sessionData = {
        event: event.id,
        name: formData.name.trim(),
        description: formData.description.trim(),
        date: formData.date,
        start_time: formData.start_time,
        end_time: formData.end_time,
        location: formData.location.trim(),
        max_capacity: parseInt(formData.max_capacity) || 0,
        is_attendance_required: formData.is_attendance_required,
        is_public: formData.is_public,
        session_type: formData.session_type,
        speakers: formData.speakers.filter(s => s.trim()),
        requirements: formData.requirements.filter(r => r.trim()),
        forms: formData.forms
      };

      if (editingSession) {
        await updateSession({ ...sessionData, _id: editingSession._id });
      } else {
        await createSession(sessionData);
      }
    } catch (error) {
      console.error("Error saving session:", error);
      toast.error("Error saving session. Please try again.");
    }
  };

  const handleDelete = async (session) => {
    if (!confirm("Are you sure you want to delete this session?")) {
      return;
    }

    try {
      setSessionToDelete(session);
      // Pass the session data as the request body for the delete endpoint
      await deleteSession({
        event: session.event,
        name: session.name,
        description: session.description,
        date: session.date,
        start_time: session.start_time,
        end_time: session.end_time,
        location: session.location,
        max_capacity: session.max_capacity,
        is_attendance_required: session.is_attendance_required,
        is_public: session.is_public,
        session_type: session.session_type,
        speakers: session.speakers,
        requirements: session.requirements
      });
    } catch (error) {
      console.error("Error deleting session:", error);
      toast.error("Error deleting session. Please try again.");
    }
  };

  const toggleSessionVisibility = async (session) => {
    try {
      setEditingSession(session);
      const updateManager = UpdateSessionManager(session._id);
      await updateManager.updateSession({
        ...session,
        is_public: !session.is_public
      });
      refetchSessions();
    } catch (error) {
      console.error("Error updating session visibility:", error);
      toast.error("Error updating session visibility. Please try again.");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      upcoming: "bg-blue-100 text-blue-800",
      active: "bg-green-100 text-green-800",
      ongoing: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getTypeIcon = (type) => {
    const icons = {
      main_event: Calendar,
      workshop: Settings,
      networking: Users,
      break: Clock,
      ceremony: CheckCircle,
      presentation: BarChart3,
      other: AlertCircle
    };
    return icons[type] || Calendar;
  };

  const formatDateTime = (date, time) => {
    return `${new Date(date).toLocaleDateString()} at ${time}`;
  };

  const getTotalStats = () => {
    const totalRegistered = sessions.reduce((sum, session) => sum + (session.registered_count || 0), 0);
    const totalAttended = sessions.reduce((sum, session) => sum + (session.attended_count || 0), 0);
    const averageAttendance = totalRegistered > 0 ? Math.round((totalAttended / totalRegistered) * 100) : 0;

    return {
      totalSessions: sessions.length,
      totalRegistered,
      totalAttended,
      averageAttendance
    };
  };

  const stats = getTotalStats();

  // Handle marking attendance for session
  const handleMarkAttendance = async () => {
    if (!attendanceCode.trim() || !viewingSession) {
      toast.error("Please enter an invitee code");
      return;
    }

    try {
      await sessionAttendanceManager.markAttendance({
        invitee_code: attendanceCode.trim(),
        marking_method: "manual"
      });
      setAttendanceCode("");
      refetchAttendance();
      toast.success("Attendance marked successfully");
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast.error("Failed to mark attendance");
    }
  };

  // Handle viewing session details
  const handleViewSession = (session, view = "overview") => {
    setViewingSession(session);
    setActiveView(view);
  };

  // Close session view
  const handleCloseSessionView = () => {
    setViewingSession(null);
    setActiveView("overview");
    setAttendanceCode("");
  };

  if (loadingSessions) {
    return <Loader />;
  }

  // If viewing a specific session, show session detail view
  if (viewingSession) {
    return (
      <div className="space-y-6">
        {/* Session View Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCloseSessionView}
              className="p-2 text-gray-500 hover:text-gray-700 rounded"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-2xl font-semibold">{viewingSession.name}</h2>
              <p className="text-gray-600">{viewingSession.description}</p>
            </div>
          </div>
        </div>

        {/* Session View Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveView("overview")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeView === "overview"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView("registrations")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeView === "registrations"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Registrations ({viewingSession.registered_count || 0})
            </button>
            <button
              onClick={() => setActiveView("attendance")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeView === "attendance"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Attendance ({viewingSession.attended_count || 0})
            </button>
          </nav>
        </div>

        {/* Session View Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeView === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-4">Session Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(viewingSession.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{viewingSession.start_time} - {viewingSession.end_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{viewingSession.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span>Capacity: {viewingSession.max_capacity}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-2xl font-bold text-blue-600">
                        {viewingSession.registered_count || 0}
                      </div>
                      <div className="text-xs text-blue-600">Registered</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-2xl font-bold text-green-600">
                        {viewingSession.attended_count || 0}
                      </div>
                      <div className="text-xs text-green-600">Attended</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance Marking for Required Sessions */}
              {viewingSession.is_attendance_required && (
                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Mark Attendance</h3>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={attendanceCode}
                      onChange={(e) => setAttendanceCode(e.target.value)}
                      placeholder="Enter invitee code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <CustomButton
                      buttonText="Mark Present"
                      prefixIcon={<UserCheck className="w-4 h-4" />}
                      buttonColor="bg-green-600"
                      radius="rounded-md"
                      onClick={handleMarkAttendance}
                      isLoading={sessionAttendanceManager.isLoading}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeView === "registrations" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Session Registrations</h3>
                <button
                  onClick={refetchRegistrations}
                  className="text-purple-600 hover:text-purple-700 text-sm"
                >
                  Refresh
                </button>
              </div>
              {loadingRegistrations ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
                  <p className="mt-2 text-gray-600">Loading registrations...</p>
                </div>
              ) : registrationsData?.data?.length > 0 ? (
                <div className="space-y-3">
                  {registrationsData.data.map((registration) => (
                    <div key={registration._id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <div className="font-medium">{registration.name}</div>
                        <div className="text-sm text-gray-600">{registration.email}</div>
                        <div className="text-xs text-gray-500">Code: {registration.invitee_code}</div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(registration.registered_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No registrations found for this session
                </div>
              )}
            </div>
          )}

          {activeView === "attendance" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Session Attendance</h3>
                <button
                  onClick={refetchAttendance}
                  className="text-purple-600 hover:text-purple-700 text-sm"
                >
                  Refresh
                </button>
              </div>
              {loadingAttendance ? (
                <div className="text-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
                  <p className="mt-2 text-gray-600">Loading attendance...</p>
                </div>
              ) : attendanceData?.data?.length > 0 ? (
                <div className="space-y-3">
                  {attendanceData.data.map((attendance) => (
                    <div key={attendance._id} className="flex items-center justify-between p-3 bg-green-50 rounded">
                      <div>
                        <div className="font-medium">{attendance.name}</div>
                        <div className="text-sm text-gray-600">{attendance.email}</div>
                        <div className="text-xs text-gray-500">Code: {attendance.invitee_code}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-green-600 font-medium">
                          {attendance.marking_method}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(attendance.marked_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No attendance records found for this session
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Sessions Management</h2>
          <p className="text-gray-600">
            Manage multiple sessions, days, and attendance tracking for your event
          </p>
        </div>
        
        <CustomButton
          buttonText="Add Session"
          prefixIcon={<Plus className="w-4 h-4" />}
          buttonColor="bg-purple-600"
          radius="rounded-md"
          onClick={() => handleOpenModal()}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Sessions</p>
              <p className="text-2xl font-semibold">{stats.totalSessions}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Total Registered</p>
              <p className="text-2xl font-semibold">{stats.totalRegistered}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Total Attended</p>
              <p className="text-2xl font-semibold">{stats.totalAttended}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Avg. Attendance</p>
              <p className="text-2xl font-semibold">{stats.averageAttendance}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {sessions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
            <p className="text-gray-500 mb-4">
              Create sessions to organize your multi-day event and track attendance
            </p>
            <CustomButton
              buttonText="Create First Session"
              prefixIcon={<Plus className="w-4 h-4" />}
              buttonColor="bg-purple-600"
              radius="rounded-md"
              onClick={() => handleOpenModal()}
            />
          </div>
        ) : (
          sessions.map((session) => {
            const TypeIcon = getTypeIcon(session.session_type);
            return (
              <div
                key={session._id}
                className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TypeIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{session.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status?.charAt(0).toUpperCase() + session.status?.slice(1)}
                        </span>
                        {session.is_attendance_required && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            Attendance Required
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">{session.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDateTime(session.date, session.start_time)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{session.start_time} - {session.end_time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{session.location}</span>
                        </div>
                      </div>

                      {session.speakers && session.speakers.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm text-gray-500">Speakers: </span>
                          <span className="text-sm text-gray-700">{session.speakers.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {session.is_attendance_required && (
                      <button
                        onClick={() => handleViewSession(session, "overview")}
                        className="p-2 text-gray-500 hover:text-purple-600 rounded"
                        title="Manage attendance"
                      >
                        <UserCheck className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleViewSession(session, "registrations")}
                      className="p-2 text-gray-500 hover:text-blue-600 rounded"
                      title="View registrations"
                    >
                      <UserPlus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleViewSession(session, "attendance")}
                      className="p-2 text-gray-500 hover:text-green-600 rounded"
                      title="View attendance"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleSessionVisibility(session)}
                      className={`p-2 rounded ${session.is_public ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'}`}
                      title={session.is_public ? "Public" : "Private"}
                    >
                      {session.is_public ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleOpenModal(session)}
                      className="p-2 text-gray-500 hover:text-blue-600 rounded"
                      title="Edit session"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(session)}
                      className="p-2 text-gray-500 hover:text-red-600 rounded"
                      title="Delete session"
                      disabled={deleting}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Attendance Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Attendance Progress</span>
                    <span className="font-medium">
                      {session.attended_count || 0} / {session.registered_count || 0} 
                      ({Math.round(((session.attended_count || 0) / (session.registered_count || 1)) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(session.registered_count || 0) > 0 ? ((session.attended_count || 0) / (session.registered_count || 1)) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Capacity: {session.max_capacity || 0}</span>
                    <span>Registered: {session.registered_count || 0}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  {editingSession ? "Edit Session" : "Add New Session"}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Session Name *"
                    placeholder="Enter session name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    isRequired={true}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Type
                    </label>
                    <select
                      value={formData.session_type}
                      onChange={(e) => handleInputChange("session_type", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    >
                      {sessionTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <InputWithFullBoarder
                  label="Description"
                  placeholder="Session description"
                  isTextArea={true}
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputWithFullBoarder
                    label="Date *"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    isRequired={true}
                  />
                  
                  <InputWithFullBoarder
                    label="Start Time *"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => handleInputChange("start_time", e.target.value)}
                    isRequired={true}
                  />
                  
                  <InputWithFullBoarder
                    label="End Time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => handleInputChange("end_time", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Location"
                    placeholder="Session location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                  
                  <InputWithFullBoarder
                    label="Max Capacity"
                    type="number"
                    placeholder="Maximum attendees"
                    value={formData.max_capacity}
                    onChange={(e) => handleInputChange("max_capacity", e.target.value)}
                  />
                </div>

                {/* Speakers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Speakers
                  </label>
                  <div className="space-y-2">
                    {formData.speakers.map((speaker, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={speaker}
                          onChange={(e) => handleArrayChange("speakers", index, e.target.value)}
                          placeholder={`Speaker ${index + 1}`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        />
                        <button
                          onClick={() => removeArrayItem("speakers", index)}
                          className="text-red-500 hover:text-red-700 px-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem("speakers")}
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm"
                    >
                      <Plus className="h-3 w-3" />
                      Add Speaker
                    </button>
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements
                  </label>
                  <div className="space-y-2">
                    {formData.requirements.map((requirement, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={requirement}
                          onChange={(e) => handleArrayChange("requirements", index, e.target.value)}
                          placeholder={`Requirement ${index + 1}`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        />
                        <button
                          onClick={() => removeArrayItem("requirements", index)}
                          className="text-red-500 hover:text-red-700 px-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addArrayItem("requirements")}
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm"
                    >
                      <Plus className="h-3 w-3" />
                      Add Requirement
                    </button>
                  </div>
                </div>

                {/* Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_attendance_required}
                      onChange={(e) => handleInputChange("is_attendance_required", e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Attendance Required</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_public}
                      onChange={(e) => handleInputChange("is_public", e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Public Session</span>
                  </label>
                </div>

                {/* Forms Selection - Only show when attendance is required */}
                {formData.is_attendance_required && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Required Forms for Registration
                    </label>
                    <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-3">
                      {loadingForms ? (
                        <div className="text-sm text-gray-500">Loading forms...</div>
                      ) : formsData?.data?.length === 0 ? (
                        <div className="text-sm text-gray-500 italic">No forms found for this event</div>
                      ) : (
                        <>
                          {/* Filter out forms that are marked as required (those are for event registration only) */}
                          {(formsData?.data || [])
                            .filter(form => !form.is_required)
                            .map((form) => (
                              <label key={form._id} className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={formData.forms.includes(form._id)}
                                  onChange={(e) => {
                                    const newForms = e.target.checked
                                      ? [...formData.forms, form._id]
                                      : formData.forms.filter(id => id !== form._id);
                                    handleInputChange("forms", newForms);
                                  }}
                                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <span className="text-sm text-gray-700">{form.description}</span>
                              </label>
                            ))}
                          {(formsData?.data || []).filter(form => !form.is_required).length === 0 && (
                            <div className="text-sm text-gray-500 italic">
                              No available forms for session registration. All forms are marked as required for event registration.
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <CustomButton
                    buttonText={editingSession ? "Update Session" : "Create Session"}
                    prefixIcon={<Save className="w-4 h-4" />}
                    buttonColor="bg-purple-600"
                    radius="rounded-md"
                    isLoading={creating || updating}
                    onClick={handleSave}
                  />
                  <CustomButton
                    buttonText="Cancel"
                    buttonColor="bg-gray-300"
                    textColor="text-gray-700"
                    radius="rounded-md"
                    onClick={handleCloseModal}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsManagementTab;