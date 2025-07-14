"use client";

import React, { useState } from "react";
import { Event, ProgramItem } from "@/app/events/types";
import jsPDF from "jspdf";
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
import {
  AddProgramManager,
  UpdateProgramManager,
  DeleteProgramManager,
} from "@/app/events/controllers/programController";

interface AgendaItemProps {
  item: ProgramItem;
  onEdit: (item: ProgramItem) => void;
  onDelete: (itemId: string) => void;
  onToggleVisibility: (itemId: string, isPublic: boolean) => void;
  isLoading: boolean;
  formatDate: (dateString: string) => string;
}

const AgendaItem: React.FC<AgendaItemProps> = ({
  item,
  onEdit,
  onDelete,
  onToggleVisibility,
  isLoading,
  formatDate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getItemTypeIcon = (type: string) => {
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

  const getItemTypeColor = (type: string) => {
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

  const formatTime = (timeString: string) => {
    // Time is already in 12-hour format from API (e.g., "8:02 am")
    return timeString;
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
              <h4 className="font-medium text-gray-900 truncate">
                {item.title}
              </h4>
              <span
                className={`px-2 py-1 text-xs rounded ${getItemTypeColor(
                  item.type
                )}`}
              >
                {item.type}
              </span>
              {item.is_public === false && (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                  Private
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(item.date)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(item.start_time)} - {formatTime(item.end_time)}
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
                {item.speakerTitle && (
                  <span className="text-xs">- {item.speakerTitle}</span>
                )}
              </div>
            )}

            {!isExpanded && item.description && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {item.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
            title={isExpanded ? "Show less" : "Show more"}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => onToggleVisibility(item.id, !item.is_public)}
            className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
            title={item.is_public ? "Make private" : "Make public"}
          >
            {item.is_public ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
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
              <h5 className="font-medium text-gray-900 mb-1">
                Learning Objectives
              </h5>
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

interface AgendaModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ProgramItem | null;
  onSave: (itemData: any) => void;
  isLoading: boolean;
}

const AgendaModal: React.FC<AgendaModalProps> = ({ isOpen, onClose, item, onSave, isLoading }) => {
  interface FormData {
    title: string;
    description: string;
    type: string;
    startTime: string;
    endTime: string;
    location: string;
    speaker: string;
    speakerTitle: string;
    isPublic: boolean;
    objectives: string[];
    materials: Array<{name: string; url: string}>;
  }

  const [formData, setFormData] = useState<FormData>({
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
        title: item.title || item.description || "",
        description: item.description || "",
        type: item.type || "presentation",
        startTime: item.start_time || "",
        endTime: item.end_time || "",
        location: item.location || "",
        speaker: item.speaker || "",
        speakerTitle: item.speaker_title || "",
        isPublic: item.is_public !== undefined ? item.is_public : true,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.startTime) {
      alert("Please fill in all required fields");
      return;
    }

    const agendaData = {
      ...formData,
      id: item?.id,
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

interface ProgramManagementTabProps {
  event: Event;
}

const ProgramManagementTab: React.FC<ProgramManagementTabProps> = ({ event }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("time");

  // Helper function to convert 24-hour time to 12-hour format with am/pm
  const convertTo12HourFormat = (time24: string): string => {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "pm" : "am";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Helper function to format date
  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString([], {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Controllers
  const {
    addProgram,
    isLoading: adding,
    isSuccess: addSuccess,
  } = AddProgramManager();
  const {
    updateProgram,
    isLoading: updating,
    isSuccess: updateSuccess,
  } = UpdateProgramManager();
  const {
    deleteProgram,
    isLoading: deleting,
    isSuccess: deleteSuccess,
  } = DeleteProgramManager();

  const isLoading = adding || updating || deleting;

  // Get agenda items directly from event prop - no local storage
  const agendaItems: ProgramItem[] = event?.program && Array.isArray(event.program) ? event.program : [];

  const handleAddItem = (): void => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: ProgramItem): void => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (itemData: any): Promise<void> => {
    try {
      // Include ALL frontend data points, even if backend doesn't support them yet
      const completeProgramItem = {
        // Backend-supported fields
        description: itemData.title, // Backend uses description for title
        date: event?.date || new Date().toISOString().split("T")[0],
        start_time: convertTo12HourFormat(itemData.startTime),
        end_time: convertTo12HourFormat(itemData.endTime),
        location: itemData.location,
        speaker: itemData.speaker,
        speaker_title: itemData.speakerTitle,
        is_public: itemData.isPublic,

        // ADDITIONAL frontend data points backend should support
        title: itemData.title, // Separate title field
        type: itemData.type, // keynote, workshop, panel, break, lunch, etc.
        objectives: itemData.objectives || [], // Learning objectives array
        materials: itemData.materials || [], // Materials array with name/url
        id: itemData.id,
      };

      if (editingItem) {
        // Update existing item
        // Map through current items and update the edited one
        const updatedItems = agendaItems.map((item) =>
          item.id === editingItem.id ? { ...item, ...itemData } : item
        );
        await updateProgram(
          event.id,
          updatedItems.map((item) => ({
            // Backend format
            description: item.title || item.description,
            date: event?.date || new Date().toISOString().split("T")[0],
            start_time: convertTo12HourFormat(item.startTime || item.start_time),
            end_time: convertTo12HourFormat(item.endTime || item.end_time),
            location: item.location,
            speaker: item.speaker,
            speaker_title: item.speakerTitle || item.speaker_title,
            is_public: item.isPublic !== undefined ? item.isPublic : item.is_public,
          }))
        );
      } else {
        // Add new item
        await addProgram(event.id, [completeProgramItem]);
      }

      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error("Error saving program item:", error);
      alert("Error saving program item. Please try again.");
    }
  };

  const handleDeleteItem = async (itemId: string): Promise<void> => {
    if (confirm("Are you sure you want to delete this agenda item?")) {
      try {
        await deleteProgram(event.id, [itemId]);
      } catch (error) {
        console.error("Error deleting program item:", error);
        alert("Error deleting program item. Please try again.");
      }
    }
  };

  const handleToggleVisibility = async (itemId: string, isPublic: boolean): Promise<void> => {
    try {
      // Update visibility for specific item
      const updatedItems = agendaItems.map((item) =>
        item.id === itemId ? { ...item, is_public: isPublic } : item
      );
      await updateProgram(
        event.id,
        updatedItems.map((item) => ({
          description: item.title || item.description,
          date: event?.date || new Date().toISOString().split("T")[0],
          start_time: convertTo12HourFormat(item.start_time),
          end_time: convertTo12HourFormat(item.end_time),
          location: item.location,
          speaker: item.speaker,
          speaker_title: item.speaker_title,
          is_public: item.is_public,
        }))
      );
    } catch (error) {
      console.error("Error updating program visibility:", error);
      alert("Error updating program visibility. Please try again.");
    }
  };

  const handleGeneratePDF = (): void => {
    const doc = new jsPDF();
    
    // Set font
    doc.setFont('helvetica');
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(45, 27, 105); // Purple color
    doc.text('EVENT PROGRAM', 105, 30, { align: 'center' });
    
    doc.setFontSize(16);
    doc.setTextColor(74, 85, 104);
    doc.text(event?.name || 'Event Name', 105, 45, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(113, 128, 150);
    doc.text(`Date: ${event?.date ? formatDate(event.date) : ''}`, 105, 55, { align: 'center' });
    doc.text(`Venue: ${event?.venue || ''}`, 105, 65, { align: 'center' });
    
    // Line under header
    doc.setDrawColor(124, 58, 237);
    doc.setLineWidth(1);
    doc.line(20, 75, 190, 75);
    
    let yPosition = 90;
    
    // Program items
    agendaItems.forEach((item, index) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }
      
      // Date and time
      doc.setFontSize(10);
      doc.setTextColor(124, 58, 237);
      doc.setFont('helvetica', 'bold');
      doc.text(`${formatDate(item.date)} | ${item.start_time} - ${item.end_time}`, 20, yPosition);
      yPosition += 10;
      
      // Title
      doc.setFontSize(14);
      doc.setTextColor(45, 55, 72);
      doc.setFont('helvetica', 'bold');
      const titleLines = doc.splitTextToSize(item.title || item.description, 170);
      doc.text(titleLines, 20, yPosition);
      yPosition += titleLines.length * 7;
      
      // Speaker
      if (item.speaker) {
        doc.setFontSize(10);
        doc.setTextColor(74, 85, 104);
        doc.setFont('helvetica', 'normal');
        doc.text(`Speaker: ${item.speaker}${item.speaker_title ? ` - ${item.speaker_title}` : ''}`, 20, yPosition);
        yPosition += 8;
      }
      
      // Location
      if (item.location) {
        doc.setFontSize(10);
        doc.setTextColor(74, 85, 104);
        doc.text(`Location: ${item.location}`, 20, yPosition);
        yPosition += 8;
      }
      
      // Type
      doc.setFontSize(9);
      doc.setTextColor(74, 85, 104);
      doc.setFont('helvetica', 'bold');
      doc.text((item.type || 'presentation').toUpperCase(), 20, yPosition);
      yPosition += 8;
      
      // Description
      if (item.description && item.description !== (item.title || item.description)) {
        doc.setFontSize(9);
        doc.setTextColor(74, 85, 104);
        doc.setFont('helvetica', 'normal');
        const descLines = doc.splitTextToSize(item.description, 170);
        doc.text(descLines, 20, yPosition);
        yPosition += descLines.length * 5;
      }
      
      yPosition += 10; // Space between items
    });
    
    // Save the PDF
    const fileName = `${event?.name || 'Event'}_Program_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  // No local filtering - data comes pre-filtered from endpoint
  const itemTypes = ["all", "presentation", "keynote", "workshop", "panel", "break", "lunch", "networking", "award"];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            Event Program & Agenda
          </h2>
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
            {itemTypes.map((type) => (
              <option key={type} value={type}>
                {type === "all"
                  ? "All Types"
                  : type.charAt(0).toUpperCase() + type.slice(1)}
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
      {agendaItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {agendaItems.length === 0
              ? "No program items yet"
              : "No items match your filters"}
          </h3>
          <p className="text-gray-500 mb-4">
            {agendaItems.length === 0
              ? "Start by adding items to your event program."
              : "Try adjusting your filters to see more items."}
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
          {agendaItems.map((item) => (
            <AgendaItem
              key={item.id}
              item={item}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              onToggleVisibility={handleToggleVisibility}
              isLoading={isLoading}
              formatDate={formatDate}
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
