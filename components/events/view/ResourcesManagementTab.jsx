"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  FileText,
  Download,
  Eye,
  FolderOpen,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import Loader from "@/components/Loader";
import { AddResourcesManager, UpdateResourcesManager, DeleteResourcesManager } from "@/app/events/controllers/eventManagementController";
import useFileUpload from "@/utils/fileUploadController";

const ResourceCard = ({ resource, onEdit, onDelete, isLoading }) => {
  const {
    id,
    name,
    description,
    type,
    url,
    file_size,
    is_public,
    download_count,
    category,
    tags,
    createdAt,
  } = resource;

  const getResourceIcon = (type) => {
    switch (type) {
      case "document":
        return <FileText className="w-5 h-5 text-blue-600" />;
      case "image":
        return <ImageIcon className="w-5 h-5 text-green-600" />;
      case "video":
        return <Video className="w-5 h-5 text-purple-600" />;
      case "link":
        return <LinkIcon className="w-5 h-5 text-orange-600" />;
      default:
        return <FolderOpen className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "document":
        return "bg-blue-100 text-blue-800";
      case "image":
        return "bg-green-100 text-green-800";
      case "video":
        return "bg-purple-100 text-purple-800";
      case "link":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
            {getResourceIcon(type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-gray-900 truncate">{name}</h4>
              <span className={`px-2 py-1 text-xs rounded ${getTypeColor(type)}`}>
                {type}
              </span>
              {!is_public && (
                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                  Private
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {file_size && <span>{formatFileSize(file_size)}</span>}
              {download_count !== undefined && (
                <span className="flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {download_count} downloads
                </span>
              )}
              <span>Added {formatDate(createdAt)}</span>
            </div>
            {category && (
              <div className="mt-2">
                <span className="text-xs text-gray-500">Category: </span>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                  {category}
                </span>
              </div>
            )}
            {tags && (
              <div className="mt-2 flex flex-wrap gap-1">
                {(Array.isArray(tags) ? tags : tags.split(",").map(t => t.trim())).map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-2">
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
              title="View/Download resource"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={() => onEdit(resource)}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
            title="Edit resource"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(id)}
            disabled={isLoading}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Delete resource"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ResourceModal = ({ isOpen, onClose, resource, onSave, isLoading }) => {
  const { handleFileUpload, isLoading: uploading, progress } = useFileUpload();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "document",
    url: "",
    category: "",
    tags: [],
    is_public: true,
    file_size: null,
  });
  const [resourceMode, setResourceMode] = useState("url"); // "url" or "upload"
  const [selectedFile, setSelectedFile] = useState(null);

  React.useEffect(() => {
    if (resource) {
      setFormData({
        name: resource.name || "",
        description: resource.description || "",
        type: resource.type || "document",
        url: resource.url || "",
        category: resource.category || "",
        tags: Array.isArray(resource.tags) ? resource.tags : (resource.tags ? resource.tags.split(",").map(t => t.trim()) : []),
        is_public: resource.is_public !== undefined ? resource.is_public : true,
        file_size: resource.file_size || null,
      });
      setResourceMode(resource.file ? "upload" : "url");
      // Initialize tags input with existing tags as comma-separated string
      setTagsInput(Array.isArray(resource.tags) ? resource.tags.join(", ") : (resource.tags || ""));
    } else {
      setFormData({
        name: "",
        description: "",
        type: "document",
        url: "",
        category: "",
        tags: [],
        is_public: true,
        file_size: null,
      });
      setResourceMode("url");
      setSelectedFile(null);
      setTagsInput("");
    }
  }, [resource, isOpen]);

  const [tagsInput, setTagsInput] = useState("");

  const handleTagsChange = (e) => {
    const value = e.target.value;
    setTagsInput(value);
    
    // Convert to array for storage
    const tagsArray = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    setFormData({ ...formData, tags: tagsArray });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFormData({ 
        ...formData, 
        name: !formData.name.trim() ? file.name : formData.name,
        url: "" // Clear URL when file is selected
      });
      setResourceMode("upload");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation - must have name and either URL or file
    if (!formData.name.trim()) {
      alert("Please enter a resource name");
      return;
    }
    
    if (!formData.url.trim() && !selectedFile) {
      alert("Please either paste a URL or upload a file");
      return;
    }

    let finalUrl = formData.url;
    
    // If file is selected, upload it to Backblaze first
    if (selectedFile && resourceMode === "upload") {
      try {
        finalUrl = await handleFileUpload(selectedFile);
        if (!finalUrl) {
          alert("Failed to upload file. Please try again.");
          return;
        }
      } catch (error) {
        console.error("File upload error:", error);
        alert("Failed to upload file. Please try again.");
        return;
      }
    }

    const resourceData = {
      ...formData,
      url: finalUrl, // Use the uploaded URL or the provided URL
      id: resource?.id || `resource_${Date.now()}`,
      download_count: resource?.download_count || 0,
      createdAt: resource?.createdAt || new Date().toISOString(),
      file_size: selectedFile?.size || formData.file_size,
      mode: resourceMode,
    };

    onSave(resourceData);
  };

  if (!isOpen) return null;

  const resourceTypes = [
    { value: "document", label: "Document" },
    { value: "image", label: "Image" },
    { value: "video", label: "Video" },
    { value: "link", label: "Link/URL" },
    { value: "other", label: "Other" },
  ];

  const categories = [
    "Presentations",
    "Documents",
    "Images",
    "Videos",
    "Links",
    "Templates",
    "Guides",
    "Resources",
    "Other",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {resource ? "Edit Resource" : "Add New Resource"}
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
                label="Resource Name *"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter resource name"
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
                  {resourceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Unified Resource Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resource Source *
              </label>
              <div className="space-y-2">
                {/* URL Input */}
                <InputWithFullBoarder
                  label=""
                  value={formData.url}
                  onChange={(e) => {
                    setFormData({ ...formData, url: e.target.value });
                    if (e.target.value) {
                      setSelectedFile(null);
                      setResourceMode("url");
                    }
                  }}
                  placeholder="Paste URL here (e.g., https://example.com/resource)"
                  type="url"
                />
                
                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">OR</span>
                  </div>
                </div>

                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="resourceFile"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.mp3,.zip,.rar"
                  />
                  <label
                    htmlFor="resourceFile"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload size={32} className="text-gray-400 mb-2" />
                    <span className="text-gray-600">
                      {selectedFile ? selectedFile.name : "Click to upload file"}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PDF, DOC, PPT, XLS, images, videos, etc.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <InputWithFullBoarder
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of the resource"
              isTextArea={true}
              rows={3}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <InputWithFullBoarder
                label="Tags"
                value={tagsInput}
                onChange={handleTagsChange}
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
                Make this resource publicly accessible
              </label>
            </div>

            {uploading && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Uploading file...</span>
                  <span className="text-sm text-gray-600">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <CustomButton
                buttonText={resource ? "Update Resource" : "Add Resource"}
                type="submit"
                isLoading={isLoading || uploading}
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

const ResourcesManagementTab = ({ event }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resources, setResources] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  // Controllers
  const { addResources, isLoading: adding, isSuccess: addSuccess } = AddResourcesManager();
  const { updateResources, isLoading: updating, isSuccess: updateSuccess } = UpdateResourcesManager();
  const { deleteResources, isLoading: deleting, isSuccess: deleteSuccess } = DeleteResourcesManager();

  const isLoading = adding || updating || deleting;

  // Initialize with real data from event
  React.useEffect(() => {
    if (event?.resources && Array.isArray(event.resources)) {
      setResources(event.resources);
    } else {
      setResources([]);
    }
  }, [event]);

  const handleAddResource = () => {
    setEditingResource(null);
    setIsModalOpen(true);
  };

  const handleEditResource = (resource) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  };

  const handleSaveResource = async (resourceData) => {
    try {
      // Include ALL frontend data points, even if backend doesn't support them yet
      const resourcePayload = {
        // Backend-supported fields
        name: resourceData.name,
        type: resourceData.type,
        url: resourceData.url,
        description: resourceData.description,
        category: resourceData.category,
        tags: Array.isArray(resourceData.tags) ? resourceData.tags.join(", ") : resourceData.tags,
        is_public: resourceData.is_public,

        // ADDITIONAL frontend data points backend should support
        file_size: resourceData.file_size, // File size in bytes
        download_count: resourceData.download_count || 0, // Download tracking
        createdAt: resourceData.createdAt, // Creation timestamp
      };

      if (editingResource) {
        // Update existing resource
        await updateResources(event.id, [resourcePayload]);
      } else {
        // Add new resource
        await addResources(event.id, [resourcePayload]);
      }
      
      setIsModalOpen(false);
      setEditingResource(null);
    } catch (error) {
      console.error("Error saving resource:", error);
      alert("Error saving resource. Please try again.");
    }
  };

  const handleDeleteResource = async (resourceId) => {
    if (confirm("Are you sure you want to delete this resource?")) {
      try {
        await deleteResources(event.id, [resourceId]);
      } catch (error) {
        console.error("Error deleting resource:", error);
        alert("Error deleting resource. Please try again.");
      }
    }
  };

  const filteredResources = resources.filter(resource => {
    const typeMatch = filterType === "all" || resource.type === filterType;
    const categoryMatch = filterCategory === "all" || resource.category === filterCategory;
    return typeMatch && categoryMatch;
  });

  const resourceTypes = ["all", "document", "image", "video", "link"];
  const categories = ["all", ...new Set(resources.map(r => r.category).filter(Boolean))];

  const totalResources = resources.length;
  const publicResources = resources.filter(r => r.is_public).length;
  const totalDownloads = resources.reduce((sum, r) => sum + (r.download_count || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Resources</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalResources}
              </p>
            </div>
            <FolderOpen className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Public Resources</p>
              <p className="text-2xl font-semibold text-green-600">
                {publicResources}
              </p>
            </div>
            <Eye className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Downloads</p>
              <p className="text-2xl font-semibold text-purple-600">
                {totalDownloads}
              </p>
            </div>
            <Download className="w-8 h-8 text-purple-500" />
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
              {resourceTypes.map(type => (
                <option key={type} value={type}>
                  {type === "all" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Category
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <CustomButton
          buttonText="Add Resource"
          onClick={handleAddResource}
          prefixIcon={<Plus size={16} />}
          buttonColor="bg-purple-600"
          radius="rounded-full"
        />
      </div>

      {/* Resources List */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {resources.length === 0 ? "No resources yet" : "No resources match your filters"}
          </h3>
          <p className="text-gray-500 mb-4">
            {resources.length === 0 
              ? "Start by adding some resources for your event attendees."
              : "Try adjusting your filters to see more resources."
            }
          </p>
          {resources.length === 0 && (
            <CustomButton
              buttonText="Add First Resource"
              onClick={handleAddResource}
              prefixIcon={<Plus size={16} />}
              buttonColor="bg-purple-600"
              radius="rounded-full"
            />
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onEdit={handleEditResource}
              onDelete={handleDeleteResource}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      {/* Resource Modal */}
      <ResourceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingResource(null);
        }}
        resource={editingResource}
        onSave={handleSaveResource}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ResourcesManagementTab;