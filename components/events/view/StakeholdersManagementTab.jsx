"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Users,
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Star,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Briefcase,
  Crown,
  Shield,
  Heart,
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import { AddStakeholdersManager, UpdateStakeholdersManager, DeleteStakeholdersManager } from "@/app/events/controllers/stakeholdersController";

const StakeholderCard = ({ stakeholder, onEdit, onDelete, onToggleStatus, isLoading }) => {
  const {
    id,
    name,
    title,
    organization,
    role,
    contact_info,
    involvement_level,
    status,
    notes,
    responsibilities,
    expertise_areas,
    availability,
    priority,
    last_contact,
    created_at,
  } = stakeholder;

  const getRoleIcon = (role) => {
    switch (role) {
      case "sponsor":
        return <Crown className="w-5 h-5 text-yellow-600" />;
      case "partner":
        return <Shield className="w-5 h-5 text-blue-600" />;
      case "speaker":
        return <Users className="w-5 h-5 text-purple-600" />;
      case "organizer":
        return <Briefcase className="w-5 h-5 text-green-600" />;
      case "volunteer":
        return <Heart className="w-5 h-5 text-red-600" />;
      case "vendor":
        return <Building2 className="w-5 h-5 text-orange-600" />;
      default:
        return <User className="w-5 h-5 text-gray-600" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "sponsor":
        return "bg-yellow-100 text-yellow-800";
      case "partner":
        return "bg-blue-100 text-blue-800";
      case "speaker":
        return "bg-purple-100 text-purple-800";
      case "organizer":
        return "bg-green-100 text-green-800";
      case "volunteer":
        return "bg-red-100 text-red-800";
      case "vendor":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "N/A";
    }
  };

  const renderStars = (level) => {
    const starCount = Math.min(parseInt(level) || 0, 5);
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={12}
        className={`${
          index < starCount ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
            {getRoleIcon(role)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-gray-900 truncate">{name}</h4>
              <span className={`px-2 py-1 text-xs rounded ${getRoleColor(role)}`}>
                {role}
              </span>
              <span className={`px-2 py-1 text-xs rounded ${getStatusColor(status)}`}>
                {status}
              </span>
              {priority && (
                <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(priority)}`}>
                  {priority} priority
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              {title && (
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3 h-3" />
                  {title}
                </span>
              )}
              {organization && (
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {organization}
                </span>
              )}
              {involvement_level && (
                <div className="flex items-center gap-1">
                  <span className="text-xs">Involvement:</span>
                  <div className="flex gap-1">{renderStars(involvement_level)}</div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
              {contact_info?.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {contact_info.email}
                </span>
              )}
              {contact_info?.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {contact_info.phone}
                </span>
              )}
              {contact_info?.address && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {contact_info.address}
                </span>
              )}
              {availability && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {availability}
                </span>
              )}
            </div>

            {expertise_areas && expertise_areas.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1">
                {expertise_areas.slice(0, 3).map((area, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    {area}
                  </span>
                ))}
                {expertise_areas.length > 3 && (
                  <span className="text-xs text-gray-500">+{expertise_areas.length - 3} more</span>
                )}
              </div>
            )}

            {responsibilities && responsibilities.length > 0 && (
              <div className="mb-2">
                <h5 className="text-xs font-medium text-gray-700 mb-1">Responsibilities:</h5>
                <ul className="text-xs text-gray-600 list-disc list-inside">
                  {responsibilities.slice(0, 2).map((resp, index) => (
                    <li key={index}>{resp}</li>
                  ))}
                  {responsibilities.length > 2 && (
                    <li>+{responsibilities.length - 2} more...</li>
                  )}
                </ul>
              </div>
            )}

            {notes && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{notes}</p>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
              {last_contact && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Last contact: {formatDate(last_contact)}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Added: {formatDate(created_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-2">
          {contact_info?.website && (
            <a
              href={contact_info.website}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
              title="Visit website"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <div className="relative">
            <select
              value={status}
              onChange={(e) => onToggleStatus(id, e.target.value)}
              className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            >
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="declined">Declined</option>
            </select>
          </div>
          <button
            onClick={() => onEdit(stakeholder)}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
            title="Edit stakeholder"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(id)}
            disabled={isLoading}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Delete stakeholder"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const StakeholderModal = ({ isOpen, onClose, stakeholder, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    organization: "",
    role: "organizer",
    contact_info: {
      email: "",
      phone: "",
      address: "",
      website: "",
    },
    involvement_level: "3",
    status: "pending",
    notes: "",
    responsibilities: [],
    expertise_areas: [],
    availability: "",
    priority: "medium",
    last_contact: "",
  });

  React.useEffect(() => {
    if (stakeholder) {
      setFormData({
        name: stakeholder.name || "",
        title: stakeholder.title || "",
        organization: stakeholder.organization || "",
        role: stakeholder.role || "organizer",
        contact_info: stakeholder.contact_info || {
          email: "",
          phone: "",
          address: "",
          website: "",
        },
        involvement_level: stakeholder.involvement_level || "3",
        status: stakeholder.status || "pending",
        notes: stakeholder.notes || "",
        responsibilities: stakeholder.responsibilities || [],
        expertise_areas: stakeholder.expertise_areas || [],
        availability: stakeholder.availability || "",
        priority: stakeholder.priority || "medium",
        last_contact: stakeholder.last_contact || "",
      });
    } else {
      setFormData({
        name: "",
        title: "",
        organization: "",
        role: "organizer",
        contact_info: {
          email: "",
          phone: "",
          address: "",
          website: "",
        },
        involvement_level: "3",
        status: "pending",
        notes: "",
        responsibilities: [],
        expertise_areas: [],
        availability: "",
        priority: "medium",
        last_contact: "",
      });
    }
  }, [stakeholder, isOpen]);

  const handleArrayFieldChange = (field, value) => {
    const arrayValue = value
      .split("\n")
      .map(item => item.trim())
      .filter(item => item.length > 0);
    setFormData({ ...formData, [field]: arrayValue });
  };

  const handleExpertiseChange = (value) => {
    const expertiseArray = value
      .split(",")
      .map(area => area.trim())
      .filter(area => area.length > 0);
    setFormData({ ...formData, expertise_areas: expertiseArray });
  };

  const handleContactInfoChange = (field, value) => {
    setFormData({
      ...formData,
      contact_info: {
        ...formData.contact_info,
        [field]: value
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role) {
      alert("Please fill in all required fields");
      return;
    }

    const stakeholderData = {
      ...formData,
      id: stakeholder?.id || `stakeholder_${Date.now()}`,
      involvement_level: parseInt(formData.involvement_level),
      created_at: stakeholder?.created_at || new Date().toISOString(),
    };

    onSave(stakeholderData);
  };

  if (!isOpen) return null;

  const roleOptions = [
    { value: "sponsor", label: "Sponsor" },
    { value: "partner", label: "Partner" },
    { value: "speaker", label: "Speaker" },
    { value: "organizer", label: "Organizer" },
    { value: "volunteer", label: "Volunteer" },
    { value: "vendor", label: "Vendor" },
    { value: "attendee", label: "Attendee" },
    { value: "media", label: "Media" },
    { value: "other", label: "Other" },
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "declined", label: "Declined" },
  ];

  const priorityOptions = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {stakeholder ? "Edit Stakeholder" : "Add New Stakeholder"}
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
                label="Name *"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter stakeholder name"
              />
              <InputWithFullBoarder
                label="Title/Position"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Job title or position"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithFullBoarder
                label="Organization"
                value={formData.organization}
                onChange={(e) =>
                  setFormData({ ...formData, organization: e.target.value })
                }
                placeholder="Company or organization"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputWithFullBoarder
                  label="Email"
                  value={formData.contact_info.email}
                  onChange={(e) => handleContactInfoChange("email", e.target.value)}
                  placeholder="email@example.com"
                  type="email"
                />
                <InputWithFullBoarder
                  label="Phone"
                  value={formData.contact_info.phone}
                  onChange={(e) => handleContactInfoChange("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  type="tel"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputWithFullBoarder
                  label="Address"
                  value={formData.contact_info.address}
                  onChange={(e) => handleContactInfoChange("address", e.target.value)}
                  placeholder="Business address"
                />
                <InputWithFullBoarder
                  label="Website"
                  value={formData.contact_info.website}
                  onChange={(e) => handleContactInfoChange("website", e.target.value)}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  {priorityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Involvement Level (1-5)
                </label>
                <select
                  value={formData.involvement_level}
                  onChange={(e) =>
                    setFormData({ ...formData, involvement_level: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="1">1 - Minimal</option>
                  <option value="2">2 - Low</option>
                  <option value="3">3 - Medium</option>
                  <option value="4">4 - High</option>
                  <option value="5">5 - Critical</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithFullBoarder
                label="Availability"
                value={formData.availability}
                onChange={(e) =>
                  setFormData({ ...formData, availability: e.target.value })
                }
                placeholder="e.g., Weekdays 9-5, Weekends only"
              />
              <InputWithFullBoarder
                label="Last Contact Date"
                value={formData.last_contact}
                onChange={(e) =>
                  setFormData({ ...formData, last_contact: e.target.value })
                }
                type="date"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsibilities (one per line)
                </label>
                <textarea
                  value={formData.responsibilities.join("\n")}
                  onChange={(e) => handleArrayFieldChange("responsibilities", e.target.value)}
                  placeholder="Event coordination&#10;Budget management&#10;Vendor relations"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  rows={3}
                />
              </div>
              <InputWithFullBoarder
                label="Expertise Areas (comma-separated)"
                value={formData.expertise_areas.join(", ")}
                onChange={(e) => handleExpertiseChange(e.target.value)}
                placeholder="marketing, event planning, logistics"
              />
            </div>

            <InputWithFullBoarder
              label="Notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Additional notes about this stakeholder"
              isTextArea={true}
              rows={3}
            />

            <div className="flex gap-3 pt-4">
              <CustomButton
                buttonText={stakeholder ? "Update Stakeholder" : "Add Stakeholder"}
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

const StakeholdersManagementTab = ({ event }) => {
  const [stakeholders, setStakeholders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStakeholder, setEditingStakeholder] = useState(null);
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  // Controllers
  const { addStakeholders, isLoading: adding, isSuccess: addSuccess } = AddStakeholdersManager();
  const { updateStakeholders, isLoading: updating, isSuccess: updateSuccess } = UpdateStakeholdersManager();
  const { deleteStakeholders, isLoading: deleting, isSuccess: deleteSuccess } = DeleteStakeholdersManager();

  const isLoading = adding || updating || deleting;

  // Initialize with real data from event
  React.useEffect(() => {
    if (event?.stakeholders && Array.isArray(event.stakeholders)) {
      setStakeholders(event.stakeholders);
    } else {
      setStakeholders([]);
    }
  }, [event]);

  const handleAddStakeholder = () => {
    setEditingStakeholder(null);
    setIsModalOpen(true);
  };

  const handleEditStakeholder = (stakeholder) => {
    setEditingStakeholder(stakeholder);
    setIsModalOpen(true);
  };

  const handleSaveStakeholder = async (stakeholderData) => {
    try {
      // Include ALL frontend data points, even if backend doesn't support them yet
      const completeStakeholderData = {
        // Basic backend-supported fields
        name: stakeholderData.name,
        title: stakeholderData.title,
        organization: stakeholderData.organization,
        role: stakeholderData.role,
        email: stakeholderData.contact_info?.email || "",
        phone: stakeholderData.contact_info?.phone || "",
        address: stakeholderData.contact_info?.address || "",
        website: stakeholderData.contact_info?.website || "",
        status: stakeholderData.status,
        priority: stakeholderData.priority,
        involvement_level: stakeholderData.involvement_level,
        availability: stakeholderData.availability,
        responsibilities: stakeholderData.responsibilities,
        expertise: Array.isArray(stakeholderData.expertise_areas) 
          ? stakeholderData.expertise_areas.join(", ") 
          : stakeholderData.expertise_areas,
        notes: stakeholderData.notes,

        // ADDITIONAL frontend data points backend should support
        contact_info: stakeholderData.contact_info, // Full contact structure
        expertise_areas: stakeholderData.expertise_areas, // Array format
        last_contact: stakeholderData.last_contact,
        created_at: stakeholderData.created_at,
        id: stakeholderData.id
      };

      if (editingStakeholder) {
        // Update existing stakeholder
        const updatedStakeholders = stakeholders.map(s => 
          s.id === editingStakeholder.id ? stakeholderData : s
        );
        await updateStakeholders(event.id, [completeStakeholderData]);
        setStakeholders(updatedStakeholders);
      } else {
        // Add new stakeholder
        const newStakeholders = [...stakeholders, stakeholderData];
        await addStakeholders(event.id, [completeStakeholderData]);
        setStakeholders(newStakeholders);
      }
      
      setIsModalOpen(false);
      setEditingStakeholder(null);
    } catch (error) {
      console.error("Error saving stakeholder:", error);
      alert("Error saving stakeholder. Please try again.");
    }
  };

  const handleDeleteStakeholder = async (stakeholderId) => {
    if (confirm("Are you sure you want to delete this stakeholder?")) {
      try {
        await deleteStakeholders(event.id, [stakeholderId]);
        setStakeholders(stakeholders.filter(s => s.id !== stakeholderId));
      } catch (error) {
        console.error("Error deleting stakeholder:", error);
        alert("Error deleting stakeholder. Please try again.");
      }
    }
  };

  const handleToggleStatus = async (stakeholderId, newStatus) => {
    try {
      const updatedStakeholders = stakeholders.map(s => 
        s.id === stakeholderId ? { ...s, status: newStatus } : s
      );
      await updateStakeholders(event.id, updatedStakeholders);
      setStakeholders(updatedStakeholders);
    } catch (error) {
      console.error("Error updating stakeholder status:", error);
      alert("Error updating stakeholder status. Please try again.");
    }
  };

  const filteredStakeholders = stakeholders.filter(stakeholder => {
    const roleMatch = filterRole === "all" || stakeholder.role === filterRole;
    const statusMatch = filterStatus === "all" || stakeholder.status === filterStatus;
    const priorityMatch = filterPriority === "all" || stakeholder.priority === filterPriority;
    return roleMatch && statusMatch && priorityMatch;
  });

  const roleOptions = ["all", ...new Set(stakeholders.map(s => s.role).filter(Boolean))];
  const statusOptions = ["all", "active", "pending", "inactive", "declined"];
  const priorityOptions = ["all", "high", "medium", "low"];

  const totalStakeholders = stakeholders.length;
  const activeStakeholders = stakeholders.filter(s => s.status === "active").length;
  const highPriorityStakeholders = stakeholders.filter(s => s.priority === "high").length;
  const roleDistribution = stakeholders.reduce((acc, s) => {
    acc[s.role] = (acc[s.role] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Stakeholders</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalStakeholders}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-semibold text-green-600">
                {activeStakeholders}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">High Priority</p>
              <p className="text-2xl font-semibold text-red-600">
                {highPriorityStakeholders}
              </p>
            </div>
            <Star className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Top Role</p>
              <p className="text-2xl font-semibold text-purple-600">
                {Object.keys(roleDistribution).length > 0 
                  ? Object.entries(roleDistribution).reduce((a, b) => roleDistribution[a[0]] > roleDistribution[b[0]] ? a : b)[0]
                  : "N/A"
                }
              </p>
            </div>
            <Award className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Role
            </label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              {roleOptions.map(role => (
                <option key={role} value={role}>
                  {role === "all" ? "All Roles" : role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Priority
            </label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              {priorityOptions.map(priority => (
                <option key={priority} value={priority}>
                  {priority === "all" ? "All Priorities" : priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <CustomButton
          buttonText="Add Stakeholder"
          onClick={handleAddStakeholder}
          prefixIcon={<Plus size={16} />}
          buttonColor="bg-purple-600"
          radius="rounded-full"
        />
      </div>

      {/* Stakeholders List */}
      {filteredStakeholders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {stakeholders.length === 0 ? "No stakeholders yet" : "No stakeholders match your filters"}
          </h3>
          <p className="text-gray-500 mb-4">
            {stakeholders.length === 0 
              ? "Start by adding stakeholders for your event."
              : "Try adjusting your filters to see more stakeholders."
            }
          </p>
          {stakeholders.length === 0 && (
            <CustomButton
              buttonText="Add First Stakeholder"
              onClick={handleAddStakeholder}
              prefixIcon={<Plus size={16} />}
              buttonColor="bg-purple-600"
              radius="rounded-full"
            />
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStakeholders.map((stakeholder) => (
            <StakeholderCard
              key={stakeholder.id}
              stakeholder={stakeholder}
              onEdit={handleEditStakeholder}
              onDelete={handleDeleteStakeholder}
              onToggleStatus={handleToggleStatus}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      {/* Stakeholder Modal */}
      <StakeholderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStakeholder(null);
        }}
        stakeholder={editingStakeholder}
        onSave={handleSaveStakeholder}
        isLoading={isLoading}
      />
    </div>
  );
};

export default StakeholdersManagementTab;