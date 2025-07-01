"use client";

import React, { useState } from "react";
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
  Settings
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";

const SessionsManagementTab = ({ event }) => {
  const [sessions, setSessions] = useState([
    {
      id: "session_1",
      name: "Day 1 - Opening Ceremony",
      description: "Welcome address, keynote presentations, and networking",
      date: "2024-07-22",
      start_time: "09:00",
      end_time: "17:00",
      location: "Main Hall",
      max_capacity: 300,
      is_attendance_required: true,
      is_public: true,
      session_type: "main_event",
      speakers: ["Dr. Sarah Johnson", "Michael Chen"],
      requirements: ["Valid ID", "Event Badge"],
      status: "upcoming",
      registered_count: 245,
      attended_count: 0,
      created_at: "2024-07-01T10:00:00"
    },
    {
      id: "session_2",
      name: "Day 2 - Workshop Sessions",
      description: "Interactive workshops and breakout sessions",
      date: "2024-07-23",
      start_time: "08:00",
      end_time: "16:00",
      location: "Conference Rooms A-D",
      max_capacity: 200,
      is_attendance_required: true,
      is_public: true,
      session_type: "workshop",
      speakers: ["Emily Rodriguez", "Mark Wilson"],
      requirements: ["Laptop Required", "Pre-registered"],
      status: "active",
      registered_count: 180,
      attended_count: 165,
      created_at: "2024-07-01T10:00:00"
    },
    {
      id: "session_3",
      name: "Day 3 - Networking & Closing",
      description: "Final networking session and closing ceremony",
      date: "2024-07-24",
      start_time: "10:00",
      end_time: "15:00",
      location: "Garden Pavilion",
      max_capacity: 250,
      is_attendance_required: false,
      is_public: true,
      session_type: "networking",
      speakers: [],
      requirements: [],
      status: "upcoming",
      registered_count: 190,
      attended_count: 0,
      created_at: "2024-07-01T10:00:00"
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("sessions");

  const [formData, setFormData] = useState({
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

  const sessionTypes = [
    { value: "main_event", label: "Main Event" },
    { value: "workshop", label: "Workshop" },
    { value: "networking", label: "Networking" },
    { value: "break", label: "Break/Lunch" },
    { value: "ceremony", label: "Ceremony" },
    { value: "presentation", label: "Presentation" }
  ];

  const handleOpenModal = (session = null) => {
    setEditingSession(session);
    
    if (session) {
      setFormData({
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
        requirements: session.requirements?.length > 0 ? session.requirements : [""]
      });
    } else {
      setFormData({
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
    }
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSession(null);
    setFormData({
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
      alert("Please enter session name, date, and start time");
      return;
    }

    setIsLoading(true);
    
    try {
      const newSession = {
        id: editingSession?.id || `session_${Date.now()}`,
        ...formData,
        max_capacity: parseInt(formData.max_capacity) || 0,
        speakers: formData.speakers.filter(s => s.trim()),
        requirements: formData.requirements.filter(r => r.trim()),
        status: editingSession?.status || "upcoming",
        registered_count: editingSession?.registered_count || 0,
        attended_count: editingSession?.attended_count || 0,
        created_at: editingSession?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingSession) {
        setSessions(prev => 
          prev.map(session => session.id === editingSession.id ? newSession : session)
        );
      } else {
        setSessions(prev => [...prev, newSession]);
      }

      // Here you would typically save to backend
      // await updateEventSessions({ eventId: event.id, sessions: [...] });

      handleCloseModal();
    } catch (error) {
      console.error("Error saving session:", error);
      alert("Error saving session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (sessionId) => {
    if (!confirm("Are you sure you want to delete this session?")) {
      return;
    }

    try {
      setSessions(prev => prev.filter(session => session.id !== sessionId));
      // await deleteEventSession({ eventId: event.id, sessionId });
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("Error deleting session. Please try again.");
    }
  };

  const toggleSessionVisibility = (sessionId) => {
    setSessions(prev => 
      prev.map(session => 
        session.id === sessionId 
          ? { ...session, is_public: !session.is_public }
          : session
      )
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      upcoming: "bg-blue-100 text-blue-800",
      active: "bg-green-100 text-green-800",
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
      presentation: BarChart3
    };
    return icons[type] || Calendar;
  };

  const formatDateTime = (date, time) => {
    return `${new Date(date).toLocaleDateString()} at ${time}`;
  };

  const getTotalStats = () => {
    const totalRegistered = sessions.reduce((sum, session) => sum + session.registered_count, 0);
    const totalAttended = sessions.reduce((sum, session) => sum + session.attended_count, 0);
    const averageAttendance = totalRegistered > 0 ? Math.round((totalAttended / totalRegistered) * 100) : 0;

    return {
      totalSessions: sessions.length,
      totalRegistered,
      totalAttended,
      averageAttendance
    };
  };

  const stats = getTotalStats();

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
                key={session.id}
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
                          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
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

                      {session.speakers.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm text-gray-500">Speakers: </span>
                          <span className="text-sm text-gray-700">{session.speakers.join(", ")}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSessionVisibility(session.id)}
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
                      onClick={() => handleDelete(session.id)}
                      className="p-2 text-gray-500 hover:text-red-600 rounded"
                      title="Delete session"
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
                      {session.attended_count} / {session.registered_count} 
                      ({Math.round((session.attended_count / session.registered_count) * 100) || 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${session.registered_count > 0 ? (session.attended_count / session.registered_count) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Capacity: {session.max_capacity}</span>
                    <span>Registered: {session.registered_count}</span>
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

                <div className="flex gap-3 pt-4">
                  <CustomButton
                    buttonText={editingSession ? "Update Session" : "Create Session"}
                    prefixIcon={<Save className="w-4 h-4" />}
                    buttonColor="bg-purple-600"
                    radius="rounded-md"
                    isLoading={isLoading}
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