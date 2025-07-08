"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  MapPin,
  Download,
  FileText,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Users,
  Mic,
  Coffee,
  Award,
  BookOpen,
  Share2,
  Save,
  X,
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import { AddProgramManager, UpdateProgramManager, DeleteProgramManager } from "@/app/events/controllers/programController";

const AgendaItem = ({ item, onEdit, onDelete, onToggleVisibility, isLoading }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getItemTypeIcon = (type) => {
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
        return <Coffee className="w-5 h-5 text-red-600" />;
      case "award":
        return <Award className="w-5 h-5 text-yellow-600" />;
      case "networking":
        return <Users className="w-5 h-5 text-indigo-600" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-600" />;
    }
  };

  const getItemTypeColor = (type) => {
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
      case "networking":
        return "bg-indigo-100 text-indigo-800";
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

  const getDuration = () => {
    if (!item.startTime || !item.endTime) return "";
    try {
      const start = new Date(`2000-01-01T${item.startTime}`);
      const end = new Date(`2000-01-01T${item.endTime}`);
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
            {getItemTypeIcon(item.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
              <span className={`px-2 py-1 text-xs rounded ${getItemTypeColor(item.type)}`}>
                {item.type}
              </span>
              {!item.isPublic && (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                  Private
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(item.startTime)} - {formatTime(item.endTime)}
                {getDuration() && <span className="text-xs">({getDuration()})</span>}
              </span>
              {item.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {item.location}
                </span>
              )}
            </div>

            {item.speaker && (
              <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                <Mic className="w-4 h-4" />
                <span>{item.speaker}</span>
                {item.speakerTitle && <span className="text-xs">- {item.speakerTitle}</span>}
              </div>
            )}

            {!isExpanded && item.description && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>
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
            onClick={() => onToggleVisibility(item.id, !item.isPublic)}
            className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
            title={item.isPublic ? "Make private" : "Make public"}
          >
            {item.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onEdit(item)}
            disabled={isLoading}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
            title="Edit agenda item"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            disabled={isLoading}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Delete agenda item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t pt-4 space-y-3">
          {item.description && (
            <div>
              <h5 className="font-medium text-gray-900 mb-1">Description</h5>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          )}

          {item.objectives && item.objectives.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 mb-1">Learning Objectives</h5>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                {item.objectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
            </div>
          )}

          {item.materials && item.materials.length > 0 && (
            <div>
              <h5 className="font-medium text-gray-900 mb-1">Materials</h5>
              <div className="space-y-1">
                {item.materials.map((material, index) => (
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
        </div>
      )}
    </div>
  );
};

const AgendaModal = ({ isOpen, onClose, item, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "presentation",
    startTime: "",
    endTime: "",
    location: "",
    speaker: "",
    speakerTitle: "",
    isPublic: true,
    objectives: [],
    materials: [],
  });

  React.useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || "",
        description: item.description || "",
        type: item.type || "presentation",
        startTime: item.startTime || "",
        endTime: item.endTime || "",
        location: item.location || "",
        speaker: item.speaker || "",
        speakerTitle: item.speakerTitle || "",
        isPublic: item.isPublic !== undefined ? item.isPublic : true,
        objectives: item.objectives || [],
        materials: item.materials || [],
      });
    } else {
      setFormData({
        title: "",
        description: "",
        type: "presentation",
        startTime: "",
        endTime: "",
        location: "",
        speaker: "",
        speakerTitle: "",
        isPublic: true,
        objectives: [],
        materials: [],
      });
    }
  }, [item, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.startTime) {
      alert("Please fill in all required fields");
      return;
    }

    const agendaData = {
      ...formData,
      id: item?.id || `agenda_${Date.now()}`,
      createdAt: item?.createdAt || new Date().toISOString(),
    };

    onSave(agendaData);
  };

  if (!isOpen) return null;

  const itemTypes = [
    { value: "presentation", label: "Presentation" },
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
              {item ? "Edit Agenda Item" : "Add New Agenda Item"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithFullBoarder
                label="Title *"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter agenda item title"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  {itemTypes.map((type) => (
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
              placeholder="Describe this agenda item"
              isTextArea={true}
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputWithFullBoarder
                label="Start Time *"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                type="time"
              />
              <InputWithFullBoarder
                label="End Time *"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                type="time"
              />
              <InputWithFullBoarder
                label="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="Room or location"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithFullBoarder
                label="Speaker/Presenter"
                value={formData.speaker}
                onChange={(e) =>
                  setFormData({ ...formData, speaker: e.target.value })
                }
                placeholder="Speaker name"
              />
              <InputWithFullBoarder
                label="Speaker Title"
                value={formData.speakerTitle}
                onChange={(e) =>
                  setFormData({ ...formData, speakerTitle: e.target.value })
                }
                placeholder="Position/Title"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_public"
                checked={formData.isPublic}
                onChange={(e) =>
                  setFormData({ ...formData, isPublic: e.target.checked })
                }
                className="mr-2"
              />
              <label htmlFor="is_public" className="text-sm text-gray-700">
                Make this item publicly visible
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <CustomButton
                buttonText={item ? "Update Item" : "Add Item"}
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
  const [agendaItems, setAgendaItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("time");

  // Controllers
  const { addProgram, isLoading: adding, isSuccess: addSuccess } = AddProgramManager();
  const { updateProgram, isLoading: updating, isSuccess: updateSuccess } = UpdateProgramManager();
  const { deleteProgram, isLoading: deleting, isSuccess: deleteSuccess } = DeleteProgramManager();

  const isLoading = adding || updating || deleting;

  // Initialize with real data from event
  React.useEffect(() => {
    if (event?.program && Array.isArray(event.program)) {
      setAgendaItems(event.program);
    } else {
      setAgendaItems([]);
    }
  }, [event]);

  const handleAddItem = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (itemData) => {
    try {
      // Include ALL frontend data points, even if backend doesn't support them yet
      const completeProgramItem = {
        // Backend-supported fields
        description: itemData.title, // Backend uses description for title
        date: event?.date || new Date().toISOString().split('T')[0],
        start_time: itemData.startTime,
        end_time: itemData.endTime,
        location: itemData.location,
        speaker: itemData.speaker,
        speaker_title: itemData.speakerTitle,
        is_public: itemData.isPublic,

        // ADDITIONAL frontend data points backend should support
        title: itemData.title, // Separate title field
        type: itemData.type, // keynote, workshop, panel, break, lunch, etc.
        objectives: itemData.objectives || [], // Learning objectives array
        materials: itemData.materials || [], // Materials array with name/url
        id: itemData.id
      };

      if (editingItem) {
        // Update existing item
        const updatedItems = agendaItems.map(item => 
          item.id === editingItem.id ? itemData : item
        );
        await updateProgram(event.id, updatedItems.map(item => ({
          // Backend format
          description: item.title,
          date: event?.date || new Date().toISOString().split('T')[0],
          start_time: item.startTime,
          end_time: item.endTime,
          location: item.location,
          speaker: item.speaker,
          speaker_title: item.speakerTitle,
          is_public: item.isPublic,
          // Additional data
          title: item.title,
          type: item.type,
          objectives: item.objectives || [],
          materials: item.materials || [],
          id: item.id
        })));
        setAgendaItems(updatedItems);
      } else {
        // Add new item
        const newItems = [...agendaItems, itemData];
        await addProgram(event.id, [completeProgramItem]);
        setAgendaItems(newItems);
      }
      
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving program item:", error);
      alert("Error saving program item. Please try again.");
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (confirm("Are you sure you want to delete this agenda item?")) {
      try {
        await deleteProgram(event.id, [itemId]);
        setAgendaItems(agendaItems.filter(item => item.id !== itemId));
      } catch (error) {
        console.error("Error deleting program item:", error);
        alert("Error deleting program item. Please try again.");
      }
    }
  };

  const handleToggleVisibility = async (itemId, isPublic) => {
    try {
      const updatedItems = agendaItems.map(item => 
        item.id === itemId ? { ...item, isPublic } : item
      );
      await updateProgram(event.id, updatedItems.map(item => ({
        description: item.title,
        date: event?.date || new Date().toISOString().split('T')[0],
        start_time: item.startTime,
        end_time: item.endTime,
        location: item.location,
        speaker: item.speaker,
        speaker_title: item.speakerTitle,
        is_public: item.isPublic
      })));
      setAgendaItems(updatedItems);
    } catch (error) {
      console.error("Error updating program visibility:", error);
      alert("Error updating program visibility. Please try again.");
    }
  };

  const handleGeneratePDF = () => {
    // Generate PDF functionality
    const printContent = `
      <html>
        <head>
          <title>Event Program - ${event?.eventName || 'Event'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .agenda-item { margin-bottom: 20px; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            .time { font-weight: bold; color: #7c3aed; }
            .title { font-size: 18px; font-weight: bold; margin: 8px 0; }
            .speaker { color: #666; font-style: italic; }
            .description { margin-top: 8px; }
            .type-badge { background: #f3f4f6; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Event Program</h1>
            <h2>${event?.eventName || 'Event Name'}</h2>
            <p>${event?.date ? new Date(event.date).toLocaleDateString() : ''}</p>
          </div>
          ${filteredAndSortedItems.map(item => `
            <div class="agenda-item">
              <div class="time">${item.startTime} - ${item.endTime}</div>
              <div class="title">${item.title}</div>
              ${item.speaker ? `<div class="speaker">${item.speaker}${item.speakerTitle ? ` - ${item.speakerTitle}` : ''}</div>` : ''}
              ${item.location ? `<div><strong>Location:</strong> ${item.location}</div>` : ''}
              <span class="type-badge">${item.type}</span>
              ${item.description ? `<div class="description">${item.description}</div>` : ''}
            </div>
          `).join('')}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const filteredAndSortedItems = agendaItems
    .filter(item => filterType === "all" || item.type === filterType)
    .sort((a, b) => {
      if (sortBy === "time") {
        return a.startTime.localeCompare(b.startTime);
      } else if (sortBy === "type") {
        return a.type.localeCompare(b.type);
      }
      return a.title.localeCompare(b.title);
    });

  const itemTypes = ["all", ...new Set(agendaItems.map(item => item.type))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Event Program & Agenda</h2>
          <p className="text-gray-600">
            Manage your event's program, schedule, and agenda items
          </p>
        </div>
        
        <div className="flex gap-3">
          <CustomButton
            buttonText="Download PDF"
            prefixIcon={<Download size={16} />}
            buttonColor="bg-green-600"
            radius="rounded-full"
            onClick={handleGeneratePDF}
          />
          <CustomButton
            buttonText="Add Item"
            prefixIcon={<Plus size={16} />}
            buttonColor="bg-purple-600"
            radius="rounded-full"
            onClick={handleAddItem}
          />
        </div>
      </div>

      {/* Controls */}
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
            {itemTypes.map(type => (
              <option key={type} value={type}>
                {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="time">Time</option>
            <option value="type">Type</option>
            <option value="title">Title</option>
          </select>
        </div>
      </div>

      {/* Agenda Items */}
      {filteredAndSortedItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {agendaItems.length === 0 ? "No program items yet" : "No items match your filters"}
          </h3>
          <p className="text-gray-500 mb-4">
            {agendaItems.length === 0 
              ? "Start by adding items to your event program."
              : "Try adjusting your filters to see more items."
            }
          </p>
          {agendaItems.length === 0 && (
            <CustomButton
              buttonText="Add First Item"
              onClick={handleAddItem}
              prefixIcon={<Plus size={16} />}
              buttonColor="bg-purple-600"
              radius="rounded-full"
            />
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedItems.map((item) => (
            <AgendaItem
              key={item.id}
              item={item}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onToggleVisibility={handleToggleVisibility}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <AgendaModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        item={editingItem}
        onSave={handleSaveItem}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ProgramManagementTab;