"use client";

import React, { useState } from "react";
import { Event, Stakeholder } from "@/app/events/types";
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
import {
  AddStakeholdersManager,
  UpdateStakeholdersManager,
  DeleteStakeholdersManager,
} from "@/app/events/controllers/stakeholdersController";

interface StakeholderCardProps {
  stakeholder: Stakeholder;
  onEdit: (stakeholder: Stakeholder) => void;
  onDelete: (stakeholderId: string) => void;
  onToggleStatus: (stakeholderId: string, newStatus: string) => void;
  isLoading: boolean;
}

const StakeholderCard: React.FC<StakeholderCardProps> = ({
  stakeholder,
  onEdit,
  onDelete,
  onToggleStatus,
  isLoading,
}) => {
  const {
    id,
    name,
    title,
    organization,
    role,
    involvement_level,
    status,
    notes,
    responsibilities,
    expertise,
    availability,
    priority,
    email,
    phone,
    address,
    website,
    createdAt,
    updatedAt,
  } = stakeholder;

  const getRoleIcon = (role: string): JSX.Element => {
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

  const getRoleColor = (role: string): string => {
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

  const getStatusColor = (status: string): string => {
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

  const getPriorityColor = (priority: string): string => {
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

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "N/A";
    }
  };

  const renderStars = (level: number): JSX.Element[] => {
    const starCount = Math.min(parseInt(level) || 0, 5);
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={12}
        className={`${
          index < starCount
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-300"
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
              <span
                className={`px-2 py-1 text-xs rounded ${getRoleColor(role)}`}
              >
                {role}
              </span>
              <span
                className={`px-2 py-1 text-xs rounded ${getStatusColor(
                  status
                )}`}
              >
                {status}
              </span>
              {priority && (
                <span
                  className={`px-2 py-1 text-xs rounded ${getPriorityColor(
                    priority
                  )}`}
                >
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
                  <div className="flex gap-1">
                    {renderStars(involvement_level)}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
              {email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {email}
                </span>
              )}
              {phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {phone}
                </span>
              )}
              {address && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {address}
                </span>
              )}
              {availability && (
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {availability}
                </span>
              )}
            </div>

            {expertise && (
              <div className="mb-2 flex flex-wrap gap-1">
                {expertise
                  .split(", ")
                  .slice(0, 3)
                  .map((area, index) => (
                    <span
                      key={index}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                    >
                      {area}
                    </span>
                  ))}
                {expertise.split(", ").length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{expertise.split(", ").length - 3} more
                  </span>
                )}
              </div>
            )}

            {responsibilities && (
              <div className="mb-2">
                <h5 className="text-xs font-medium text-gray-700 mb-1">
                  Responsibilities:
                </h5>
                <ul className="text-xs text-gray-600 list-disc list-inside">
                  {responsibilities
                    .split(", ")
                    .slice(0, 2)
                    .map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  {responsibilities.split(", ").length > 2 && (
                    <li>+{responsibilities.split(", ").length - 2} more...</li>
                  )}
                </ul>
              </div>
            )}

            {notes && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{notes}</p>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Added: {formatDate(createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-2">
          {website && (
            <a
              href={website}
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

interface StakeholderModalProps {
  isOpen: boolean;
  onClose: () => void;
  stakeholder: Stakeholder | null;
  onSave: (stakeholderData: any) => void;
  isLoading: boolean;
}

interface StakeholderFormData {
  name: string;
  title: string;
  organization: string;
  role: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  involvement_level: string;
  status: string;
  notes: string;
  responsibilities: string;
  expertise: string;
  availability: string;
  priority: string;
  last_contact: string;
}

const StakeholderModal: React.FC<StakeholderModalProps> = ({
  isOpen,
  onClose,
  stakeholder,
  onSave,
  isLoading,
}) => {
  const [formData, setFormData] = useState<StakeholderFormData>({
    name: "",
    title: "",
    organization: "",
    role: "organizer",
    email: "",
    phone: "",
    address: "",
    website: "",
    involvement_level: "3",
    status: "pending",
    notes: "",
    responsibilities: "",
    expertise: "",
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
        role: stakeholder.role?.toLowerCase() || "organizer",
        email: stakeholder.email || "",
        phone: stakeholder.phone || "",
        address: stakeholder.address || "",
        website: stakeholder.website || "",
        involvement_level: String(stakeholder.involvement_level || "3"),
        status: stakeholder.status || "pending",
        notes: stakeholder.notes || "",
        responsibilities: stakeholder.responsibilities
          ? stakeholder.responsibilities.split(", ").join("\n")
          : "",
        expertise: stakeholder.expertise || "",
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
        email: "",
        phone: "",
        address: "",
        website: "",
        involvement_level: "3",
        status: "pending",
        notes: "",
        responsibilities: "",
        expertise: "",
        availability: "",
        priority: "medium",
        last_contact: "",
      });
    }
  }, [stakeholder, isOpen]);

  const handleArrayFieldChange = (field, value) => {
    // Just store the raw value - we'll convert when submitting
    setFormData({ ...formData, [field]: value });
  };

  const handleExpertiseChange = (value) => {
    // Store as string for backend - allow commas and spaces
    setFormData({ ...formData, expertise: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role) {
      alert("Please fill in all required fields");
      return;
    }

    // Convert responsibilities from lines to comma-separated
    const stakeholderData = {
      ...formData,
      id: stakeholder?.id,
      involvement_level: parseInt(formData.involvement_level),
      responsibilities: formData.responsibilities
        .split("\n")
        .filter((line) => line.trim())
        .join(", "),
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
              <h4 className="font-medium text-gray-900 mb-3">
                Contact Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputWithFullBoarder
                  label="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="email@example.com"
                  type="email"
                />
                <InputWithFullBoarder
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+1 (555) 123-4567"
                  type="tel"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputWithFullBoarder
                  label="Address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Business address"
                />
                <InputWithFullBoarder
                  label="Website"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
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
                    setFormData({
                      ...formData,
                      involvement_level: e.target.value,
                    })
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Contact Date
                </label>
                <input
                  type="date"
                  value={formData.last_contact}
                  onChange={(e) =>
                    setFormData({ ...formData, last_contact: e.target.value })
                  }
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Select when you last contacted this person (today or earlier)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithFullBoarder
                label="Responsibilities (one per line)"
                value={formData.responsibilities}
                onChange={(e) =>
                  setFormData({ ...formData, responsibilities: e.target.value })
                }
                className={"h-[100px]"}
                isTextArea={true}
                placeholder="Event coordination&#10;Budget management&#10;Vendor relations"
              />
              <InputWithFullBoarder
                label="Expertise Areas (comma-separated)"
                value={formData.expertise}
                onChange={(e) =>
                  setFormData({ ...formData, expertise: e.target.value })
                }
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
                buttonText={
                  stakeholder ? "Update Stakeholder" : "Add Stakeholder"
                }
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

interface StakeholdersManagementTabProps {
  event: Event;
}

const StakeholdersManagementTab: React.FC<StakeholdersManagementTabProps> = ({
  event,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStakeholder, setEditingStakeholder] = useState(null);

  // Controllers
  const {
    addStakeholders,
    isLoading: adding,
    isSuccess: addSuccess,
  } = AddStakeholdersManager();
  const {
    updateStakeholders,
    isLoading: updating,
    isSuccess: updateSuccess,
  } = UpdateStakeholdersManager();
  const {
    deleteStakeholders,
    isLoading: deleting,
    isSuccess: deleteSuccess,
  } = DeleteStakeholdersManager();

  const isLoading = adding || updating || deleting;

  // Get stakeholders directly from event prop - no local storage
  const stakeholders =
    event?.stakeholders && Array.isArray(event.stakeholders)
      ? event.stakeholders
      : [];

  const handleAddStakeholder = (): void => {
    setEditingStakeholder(null);
    setIsModalOpen(true);
  };

  const handleEditStakeholder = (stakeholder: Stakeholder): void => {
    setEditingStakeholder(stakeholder);
    setIsModalOpen(true);
  };

  const handleSaveStakeholder = async (stakeholderData: any): Promise<void> => {
    try {
      // Format data to match backend expectations
      const completeStakeholderData = {
        name: stakeholderData.name,
        title: stakeholderData.title,
        organization: stakeholderData.organization,
        role:
          stakeholderData.role.charAt(0).toUpperCase() +
          stakeholderData.role.slice(1), // Capitalize role
        email: stakeholderData.email || "",
        phone: stakeholderData.phone || "",
        address: stakeholderData.address || "",
        website: stakeholderData.website || "",
        status: stakeholderData.status,
        priority: stakeholderData.priority,
        involvement_level: parseInt(stakeholderData.involvement_level),
        availability: stakeholderData.availability,
        responsibilities: stakeholderData.responsibilities,
        expertise: stakeholderData.expertise,
        notes: stakeholderData.notes,
        last_contact: stakeholderData.last_contact || "",
      };

      if (editingStakeholder) {
        // Update existing stakeholder - include ID for update
        await updateStakeholders(event.id, [
          {
            ...completeStakeholderData,
            id: stakeholderData.id,
          },
        ]);
      } else {
        // Add new stakeholder
        await addStakeholders(event.id, [completeStakeholderData]);
      }

      setIsModalOpen(false);
      setEditingStakeholder(null);
    } catch (error) {
      console.error("Error saving stakeholder:", error);
      alert("Error saving stakeholder. Please try again.");
    }
  };

  const handleDeleteStakeholder = async (
    stakeholderId: string
  ): Promise<void> => {
    if (confirm("Are you sure you want to delete this stakeholder?")) {
      try {
        await deleteStakeholders(event.id, [stakeholderId]);
      } catch (error) {
        console.error("Error deleting stakeholder:", error);
        alert("Error deleting stakeholder. Please try again.");
      }
    }
  };

  const handleToggleStatus = async (
    stakeholderId: string,
    newStatus: string
  ): Promise<void> => {
    try {
      // Update stakeholder status
      const updatedStakeholders = stakeholders.map((s) =>
        s.id === stakeholderId ? { ...s, status: newStatus } : s
      );
      await updateStakeholders(event.id, updatedStakeholders);
    } catch (error) {
      console.error("Error updating stakeholder status:", error);
      alert("Error updating stakeholder status. Please try again.");
    }
  };

  // No local filtering - data comes pre-filtered from backend
  const roleOptions = [
    "all",
    "sponsor",
    "partner",
    "speaker",
    "organizer",
    "volunteer",
    "vendor",
    "attendee",
    "media",
    "other",
  ];
  const statusOptions = ["all", "active", "pending", "inactive", "declined"];
  const priorityOptions = ["all", "high", "medium", "low"];

  const totalStakeholders = stakeholders.length;
  const activeStakeholders = stakeholders.filter(
    (s) => s.status === "active"
  ).length;
  const highPriorityStakeholders = stakeholders.filter(
    (s) => s.priority === "high"
  ).length;
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
                  ? Object.entries(roleDistribution).reduce((a, b) =>
                      roleDistribution[a[0]] > roleDistribution[b[0]] ? a : b
                    )[0]
                  : "N/A"}
              </p>
            </div>
            <Award className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <CustomButton
          buttonText="Add Stakeholder"
          onClick={handleAddStakeholder}
          prefixIcon={<Plus size={16} />}
          buttonColor="bg-purple-600"
          radius="rounded-full"
        />
      </div>

      {/* Stakeholders List */}
      {stakeholders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {stakeholders.length === 0
              ? "No stakeholders yet"
              : "No stakeholders match your filters"}
          </h3>
          <p className="text-gray-500 mb-4">
            {stakeholders.length === 0
              ? "Start by adding stakeholders for your event."
              : "Try adjusting your filters to see more stakeholders."}
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
          {stakeholders.map((stakeholder) => (
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
