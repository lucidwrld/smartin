"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Clock,
  Calendar,
  MapPin,
  User,
  Users,
  Mic,
  Play,
  Pause,
  Coffee,
  Utensils,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";

const SessionCard = ({ session, onEdit, onDelete, onToggleVisibility, isLoading }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    id,
    title,
    description,
    speaker,
    start_time,
    end_time,
    date,
    location,
    session_type,
    is_public,
    capacity,
    registered,
    materials,
    prerequisites,
    tags,
  } = session;

  const getSessionIcon = (type) => {
    switch (type) {
      case "keynote":
        return <Mic className="w-5 h-5 text-purple-600" />;
      case "workshop":
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case "panel":
        return <Users className="w-5 h-5 text-green-600" />;
      case "break":
        return <Coffee className="w-5 h-5 text-orange-600" />;
      case "lunch":
        return <Utensils className="w-5 h-5 text-red-600" />;
      case "award":
        return <Award className="w-5 h-5 text-yellow-600" />;
      default:
        return <Play className="w-5 h-5 text-gray-600" />;
    }
  };

  const getSessionTypeColor = (type) => {
    switch (type) {
      case "keynote":
        return "bg-purple-100 text-purple-800";
      case "workshop":
        return "bg-blue-100 text-blue-800";
      case "panel":
        return "bg-green-100 text-green-800";
      case "break":
        return "bg-orange-100 text-orange-800";
      case "lunch":
        return "bg-red-100 text-red-800";
      case "award":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTime = (timeString) => {
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return timeString;
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  const getDuration = () => {
    if (!start_time || !end_time) return "";
    try {
      const start = new Date(`2000-01-01T${start_time}`);
      const end = new Date(`2000-01-01T${end_time}`);
      const diffMs = end - start;
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      if (diffHrs > 0) {
        return `${diffHrs}h ${diffMins}m`;
      }
      return `${diffMins}m`;
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
            {getSessionIcon(session_type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-gray-900 truncate">{title}</h4>
              <span className={`px-2 py-1 text-xs rounded ${getSessionTypeColor(session_type)}`}>
                {session_type}
              </span>
              {!is_public && (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                  Private
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(start_time)} - {formatTime(end_time)}
                {getDuration() && <span className="text-xs">({getDuration()})</span>}
              </span>
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {location}
                </span>
              )}
            </div>

            {speaker && (
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                <User className="w-4 h-4" />
                <span>{speaker.name}</span>
                {speaker.title && <span className="text-xs">- {speaker.title}</span>}
              </div>
            )}

            {capacity && (
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {registered || 0} / {capacity} registered
                </span>
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(((registered || 0) / capacity) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}

            {!isExpanded && description && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{description}</p>
            )}

            {tags && tags.length > 0 && !isExpanded && (
              <div className="mt-2 flex flex-wrap gap-1">
                {tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
                {tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{tags.length - 3} more</span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
            title={isExpanded ? "Show less" : "Show more"}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onToggleVisibility(id, !is_public)}
            className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
            title={is_public ? "Make private" : "Make public"}
          >
            {is_public ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onEdit(session)}
            disabled={isLoading}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
            title="Edit session"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(id)}
            disabled={isLoading}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Delete session"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t pt-4 space-y-3">
          {description && (
            <div>
              <h5 className="font-medium text-gray-900 mb-1">Description</h5>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          )}

          {speaker && speaker.bio && (
            <div>
              <h5 className="font-medium text-gray-900 mb-1">Speaker Bio</h5>
              <p className="text-sm text-gray-600">{speaker.bio}</p>
            </div>
          )}

          {prerequisites && prerequisites.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 mb-1">Prerequisites</h5>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                {prerequisites.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {materials && materials.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 mb-1">Materials</h5>
              <div className="space-y-1">
                {materials.map((material, index) => (
                  <a
                    key={index}
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:text-blue-800"
                  >
                    {material.name}
                  </a>
                ))}
              </div>
            </div>
          )}

          {tags && tags.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 mb-1">Tags</h5>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SessionModal = ({ isOpen, onClose, session, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    speaker: {
      name: "",
      title: "",
      bio: "",
      image: "",
    },
    start_time: "",
    end_time: "",
    date: "",
    location: "",
    session_type: "session",
    is_public: true,
    capacity: "",
    materials: [],
    prerequisites: [],
    tags: [],
  });

  React.useEffect(() => {
    if (session) {
      setFormData({
        title: session.title || "",
        description: session.description || "",
        speaker: session.speaker || { name: "", title: "", bio: "", image: "" },
        start_time: session.start_time || "",
        end_time: session.end_time || "",
        date: session.date || "",
        location: session.location || "",
        session_type: session.session_type || "session",
        is_public: session.is_public !== undefined ? session.is_public : true,
        capacity: session.capacity || "",
        materials: session.materials || [],
        prerequisites: session.prerequisites || [],
        tags: session.tags || [],
      });
    } else {
      setFormData({
        title: "",
        description: "",
        speaker: { name: "", title: "", bio: "", image: "" },
        start_time: "",
        end_time: "",
        date: "",
        location: "",
        session_type: "session",
        is_public: true,
        capacity: "",
        materials: [],
        prerequisites: [],
        tags: [],
      });
    }
  }, [session, isOpen]);

  const handleArrayFieldChange = (field, value) => {
    const arrayValue = value
      .split("\n")
      .map(item => item.trim())
      .filter(item => item.length > 0);
    setFormData({ ...formData, [field]: arrayValue });
  };

  const handleTagsChange = (value) => {
    const tagsArray = value
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    setFormData({ ...formData, tags: tagsArray });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.date || !formData.start_time) {
      alert("Please fill in all required fields");
      return;
    }

    const sessionData = {
      ...formData,
      id: session?.id || `session_${Date.now()}`,
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
      registered: session?.registered || 0,
      createdAt: session?.createdAt || new Date().toISOString(),
    };

    onSave(sessionData);
  };

  if (!isOpen) return null;

  const sessionTypes = [
    { value: "session", label: "Session" },
    { value: "keynote", label: "Keynote" },
    { value: "workshop", label: "Workshop" },
    { value: "panel", label: "Panel Discussion" },
    { value: "break", label: "Break" },
    { value: "lunch", label: "Lunch" },
    { value: "networking", label: "Networking" },
    { value: "award", label: "Award Ceremony" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {session ? "Edit Session" : "Add New Session"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithFullBoarder
                label="Session Title *"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter session title"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Type *
                </label>
                <select
                  value={formData.session_type}
                  onChange={(e) =>
                    setFormData({ ...formData, session_type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
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
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Session description"
              isTextArea={true}
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputWithFullBoarder
                label="Date *"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                type="date"
              />
              <InputWithFullBoarder
                label="Start Time *"
                value={formData.start_time}
                onChange={(e) =>
                  setFormData({ ...formData, start_time: e.target.value })
                }
                type="time"
              />
              <InputWithFullBoarder
                label="End Time *"
                value={formData.end_time}
                onChange={(e) =>
                  setFormData({ ...formData, end_time: e.target.value })
                }
                type="time"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithFullBoarder
                label="Location/Room"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Room name or location"
              />
              <InputWithFullBoarder
                label="Capacity"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
                placeholder="Maximum attendees"
                type="number"
              />
            </div>

            {/* Speaker Information */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Speaker Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputWithFullBoarder
                  label="Speaker Name"
                  value={formData.speaker.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      speaker: { ...formData.speaker, name: e.target.value }
                    })
                  }
                  placeholder="Speaker full name"
                />
                <InputWithFullBoarder
                  label="Speaker Title"
                  value={formData.speaker.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      speaker: { ...formData.speaker, title: e.target.value }
                    })
                  }
                  placeholder="Position/Title"
                />
              </div>
              <InputWithFullBoarder
                label="Speaker Bio"
                value={formData.speaker.bio}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    speaker: { ...formData.speaker, bio: e.target.value }
                  })
                }
                placeholder="Brief speaker biography"
                isTextArea={true}
                rows={2}
              />
              <InputWithFullBoarder
                label="Speaker Image URL"
                value={formData.speaker.image}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    speaker: { ...formData.speaker, image: e.target.value }
                  })
                }
                placeholder="https://example.com/speaker-photo.jpg"
                type="url"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prerequisites (one per line)
                </label>
                <textarea
                  value={formData.prerequisites.join("\n")}
                  onChange={(e) => handleArrayFieldChange("prerequisites", e.target.value)}
                  placeholder="Basic knowledge of JavaScript&#10;Laptop required&#10;Registration fee paid"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  rows={3}
                />
              </div>
              <InputWithFullBoarder
                label="Tags (comma-separated)"
                value={formData.tags.join(", ")}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_public"
                checked={formData.is_public}
                onChange={(e) =>
                  setFormData({ ...formData, is_public: e.target.checked })
                }
                className="mr-2"
              />
              <label htmlFor="is_public" className="text-sm text-gray-700">
                Make this session publicly visible
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <CustomButton
                buttonText={session ? "Update Session" : "Add Session"}
                type="submit"
                isLoading={isLoading}
                buttonColor="bg-purple-600"
                radius="rounded-md"
              />
              <CustomButton
                buttonText="Cancel"
                onClick={onClose}
                buttonColor="bg-gray-300"
                textColor="text-gray-700"
                radius="rounded-md"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const ProgramManagementTab = ({ event }) => {
  const [sessions, setSessions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [viewMode, setViewMode] = useState("list"); // list or timeline

  // Initialize with mock data
  React.useEffect(() => {
    if (event?.program?.schedule) {
      setSessions(event.program.schedule);
    } else {
      // Mock data for demonstration
      setSessions([
        {
          id: "session_1",
          title: "Opening Keynote: The Future of Technology",
          description: "An inspiring look at emerging technologies and their impact on society. Join us as we explore the trends that will shape the next decade.",
          speaker: {
            name: "Dr. Sarah Johnson",
            title: "Chief Technology Officer, TechCorp",
            bio: "Dr. Johnson is a renowned expert in emerging technologies with over 15 years of experience in the tech industry.",
            image: "https://example.com/speaker1.jpg",
          },
          start_time: "09:00",
          end_time: "10:00",
          date: "2024-03-15",
          location: "Main Auditorium",
          session_type: "keynote",
          is_public: true,
          capacity: 500,
          registered: 387,
          materials: [
            { name: "Keynote Slides", url: "https://example.com/slides1.pdf" },
          ],
          prerequisites: [],
          tags: ["technology", "future", "innovation"],
        },
        {
          id: "session_2",
          title: "AI Workshop: Building Your First Neural Network",
          description: "Hands-on workshop where participants will build and train their first neural network using Python and TensorFlow.",
          speaker: {
            name: "Prof. Michael Chen",
            title: "AI Research Director, DataLab",
            bio: "Professor Chen has published over 50 papers on machine learning and artificial intelligence.",
            image: "https://example.com/speaker2.jpg",
          },
          start_time: "10:30",
          end_time: "12:00",
          date: "2024-03-15",
          location: "Workshop Room A",
          session_type: "workshop",
          is_public: true,
          capacity: 50,
          registered: 47,
          materials: [
            { name: "Workshop Code", url: "https://github.com/example/ai-workshop" },
            { name: "Setup Guide", url: "https://example.com/setup.pdf" },
          ],
          prerequisites: ["Basic Python knowledge", "Laptop required", "TensorFlow installed"],
          tags: ["AI", "machine learning", "hands-on", "python"],
        },
        {
          id: "session_3",
          title: "Coffee Break",
          description: "Networking break with refreshments",
          start_time: "12:00",
          end_time: "12:30",
          date: "2024-03-15",
          location: "Lobby",
          session_type: "break",
          is_public: true,
          capacity: null,
          registered: null,
          materials: [],
          prerequisites: [],
          tags: ["networking", "break"],
        },
        {
          id: "session_4",
          title: "Panel: Ethics in AI Development",
          description: "A thought-provoking discussion about the ethical implications of AI development and deployment.",
          speaker: {
            name: "Panel Discussion",
            title: "Industry Experts",
            bio: "Join leading experts from academia and industry for this important discussion.",
          },
          start_time: "13:30",
          end_time: "14:30",
          date: "2024-03-15",
          location: "Conference Room B",
          session_type: "panel",
          is_public: true,
          capacity: 200,
          registered: 156,
          materials: [],
          prerequisites: [],
          tags: ["ethics", "AI", "panel", "discussion"],
        },
        {
          id: "session_5",
          title: "Closing Ceremony & Awards",
          description: "Recognition of outstanding participants and closing remarks",
          start_time: "16:00",
          end_time: "17:00",
          date: "2024-03-15",
          location: "Main Auditorium",
          session_type: "award",
          is_public: true,
          capacity: 500,
          registered: 298,
          materials: [],
          prerequisites: [],
          tags: ["awards", "closing", "ceremony"],
        },
      ]);
    }
  }, [event]);

  const handleAddSession = () => {
    setEditingSession(null);
    setIsModalOpen(true);
  };

  const handleEditSession = (session) => {
    setEditingSession(session);
    setIsModalOpen(true);
  };

  const handleSaveSession = (sessionData) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (editingSession) {
        // Update existing session
        setSessions(sessions.map(s => 
          s.id === editingSession.id ? sessionData : s
        ));
      } else {
        // Add new session
        setSessions([...sessions, sessionData]);
      }
      
      setIsModalOpen(false);
      setEditingSession(null);
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteSession = (sessionId) => {
    if (confirm("Are you sure you want to delete this session?")) {
      setSessions(sessions.filter(s => s.id !== sessionId));
    }
  };

  const handleToggleVisibility = (sessionId, isPublic) => {
    setSessions(sessions.map(s => 
      s.id === sessionId ? { ...s, is_public: isPublic } : s
    ));
  };

  const filteredSessions = sessions.filter(session => {
    const typeMatch = filterType === "all" || session.session_type === filterType;
    const dateMatch = filterDate === "all" || session.date === filterDate;
    return typeMatch && dateMatch;
  });

  // Group sessions by date for timeline view
  const sessionsByDate = filteredSessions.reduce((acc, session) => {
    const date = session.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {});

  // Sort sessions within each date by start time
  Object.keys(sessionsByDate).forEach(date => {
    sessionsByDate[date].sort((a, b) => a.start_time.localeCompare(b.start_time));
  });

  const sessionTypes = ["all", ...new Set(sessions.map(s => s.session_type).filter(Boolean))];
  const sessionDates = ["all", ...new Set(sessions.map(s => s.date).filter(Boolean))];

  const totalSessions = sessions.length;
  const publicSessions = sessions.filter(s => s.is_public).length;
  const totalRegistrations = sessions.reduce((sum, s) => sum + (s.registered || 0), 0);
  const totalCapacity = sessions.reduce((sum, s) => sum + (s.capacity || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Sessions</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalSessions}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Public Sessions</p>
              <p className="text-2xl font-semibold text-green-600">
                {publicSessions}
              </p>
            </div>
            <Eye className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Registrations</p>
              <p className="text-2xl font-semibold text-purple-600">
                {totalRegistrations.toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Capacity</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalCapacity.toLocaleString()}
              </p>
            </div>
            <Clock className="w-8 h-8 text-gray-500" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              {sessionTypes.map(type => (
                <option key={type} value={type}>
                  {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Date
            </label>
            <select
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              {sessionDates.map(date => (
                <option key={date} value={date}>
                  {date === "all" ? "All Dates" : new Date(date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              View Mode
            </label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="list">List View</option>
              <option value="timeline">Timeline View</option>
            </select>
          </div>
        </div>

        <CustomButton
          buttonText="Add Session"
          onClick={handleAddSession}
          prefixIcon={<Plus size={16} />}
          buttonColor="bg-purple-600"
          radius="rounded-full"
        />
      </div>

      {/* Sessions List/Timeline */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {sessions.length === 0 ? "No sessions yet" : "No sessions match your filters"}
          </h3>
          <p className="text-gray-500 mb-4">
            {sessions.length === 0 
              ? "Start by adding sessions to your event program."
              : "Try adjusting your filters to see more sessions."
            }
          </p>
          {sessions.length === 0 && (
            <CustomButton
              buttonText="Add First Session"
              onClick={handleAddSession}
              prefixIcon={<Plus size={16} />}
              buttonColor="bg-purple-600"
              radius="rounded-full"
            />
          )}
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-4">
          {filteredSessions
            .sort((a, b) => {
              const dateCompare = a.date.localeCompare(b.date);
              if (dateCompare !== 0) return dateCompare;
              return a.start_time.localeCompare(b.start_time);
            })
            .map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                onEdit={handleEditSession}
                onDelete={handleDeleteSession}
                onToggleVisibility={handleToggleVisibility}
                isLoading={isLoading}
              />
            ))}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(sessionsByDate)
            .sort((a, b) => a.localeCompare(b))
            .map((date) => (
              <div key={date} className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  {new Date(date).toLocaleDateString([], { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                <div className="space-y-3">
                  {sessionsByDate[date].map((session) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onEdit={handleEditSession}
                      onDelete={handleDeleteSession}
                      onToggleVisibility={handleToggleVisibility}
                      isLoading={isLoading}
                    />
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Session Modal */}
      <SessionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSession(null);
        }}
        session={editingSession}
        onSave={handleSaveSession}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProgramManagementTab;