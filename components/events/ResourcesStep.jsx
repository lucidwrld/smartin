import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Download,
  Upload,
  FileText,
  Image,
  Film,
} from "lucide-react";
import InputWithFullBoarder from "../InputWithFullBoarder";
import CustomButton from "../Button";

export const ResourcesStep = ({ formData, onFormDataChange }) => {
  const [showAddResource, setShowAddResource] = useState(false);
  const [newResource, setNewResource] = useState({
    name: "",
    description: "",
    file: null,
    is_public: true,
  });

  const resources = formData.resources || [];

  const handleAddResource = () => {
    if (!newResource.name.trim()) {
      alert("Please enter a resource name");
      return;
    }

    if (!newResource.file) {
      alert("Please select a file to upload");
      return;
    }

    const resourceToAdd = {
      id: `resource_${Date.now()}`,
      ...newResource,
      file_type: newResource.file.type,
      file_size: newResource.file.size,
      download_count: 0,
    };

    const updatedResources = [...resources, resourceToAdd];
    onFormDataChange("resources", updatedResources);

    setNewResource({
      name: "",
      description: "",
      file: null,
      is_public: true,
    });
    setShowAddResource(false);
  };

  const handleRemoveResource = (resourceId) => {
    const updatedResources = resources.filter(
      (resource) => resource.id !== resourceId
    );
    onFormDataChange("resources", updatedResources);
  };

  const handleResourceChange = (resourceId, field, value) => {
    const updatedResources = resources.map((resource) =>
      resource.id === resourceId ? { ...resource, [field]: value } : resource
    );
    onFormDataChange("resources", updatedResources);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      setNewResource({ ...newResource, file });
    }
  };

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith("image/")) return <Image className="h-5 w-5" />;
    if (fileType?.startsWith("video/")) return <Film className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="flex flex-col w-full text-brandBlack">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Event Resources</h2>
        <p className="text-gray-600">
          Upload files that guests can download, such as programs, maps,
          presentations, or any other materials related to your event.
        </p>
      </div>

      {/* Existing Resources */}
      <div className="space-y-4 mb-6">
        {resources.map((resource, index) => (
          <div key={resource.id} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getFileIcon(resource.file_type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-lg">{resource.name}</h3>
                  {resource.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {resource.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>{formatFileSize(resource.file_size || 0)}</span>
                    <span>{resource.file_type}</span>
                    <span>{resource.download_count || 0} downloads</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleRemoveResource(resource.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Edit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
              <InputWithFullBoarder
                label="Resource Name"
                value={resource.name}
                onChange={(e) =>
                  handleResourceChange(resource.id, "name", e.target.value)
                }
              />
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  checked={resource.is_public}
                  onChange={(e) =>
                    handleResourceChange(
                      resource.id,
                      "is_public",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label className="text-sm text-gray-700">
                  Public download (visible to all guests)
                </label>
              </div>
            </div>

            <div className="mt-4">
              <InputWithFullBoarder
                label="Description"
                isTextArea={true}
                rows={2}
                value={resource.description}
                onChange={(e) =>
                  handleResourceChange(
                    resource.id,
                    "description",
                    e.target.value
                  )
                }
                placeholder="Brief description of this resource"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add Resource Button */}
      {!showAddResource && (
        <button
          onClick={() => setShowAddResource(true)}
          className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Resource
        </button>
      )}

      {/* Add Resource Form */}
      {showAddResource && (
        <div className="border-2 border-purple-200 rounded-lg p-6 bg-purple-50">
          <h3 className="font-medium text-lg mb-4">Add New Resource</h3>

          <div className="space-y-4 mb-6">
            <InputWithFullBoarder
              label="Resource Name *"
              value={newResource.name}
              onChange={(e) =>
                setNewResource({ ...newResource, name: e.target.value })
              }
              placeholder="e.g., Event Program, Venue Map"
            />

            <InputWithFullBoarder
              label="Description"
              isTextArea={true}
              rows={3}
              value={newResource.description}
              onChange={(e) =>
                setNewResource({ ...newResource, description: e.target.value })
              }
              placeholder="Brief description of what this resource contains"
            />

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition-colors">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="resource-file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.mp4,.mov,.avi"
                />
                <label htmlFor="resource-file" className="cursor-pointer">
                  {newResource.file ? (
                    <div className="flex items-center justify-center gap-2">
                      {getFileIcon(newResource.file.type)}
                      <span className="text-sm">
                        {newResource.file.name} (
                        {formatFileSize(newResource.file.size)})
                      </span>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PDF, DOC, PPT, XLS, Images, Videos (Max 10MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newResource.is_public}
                onChange={(e) =>
                  setNewResource({
                    ...newResource,
                    is_public: e.target.checked,
                  })
                }
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">
                Make this resource publicly downloadable by all guests
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <CustomButton
              buttonText="Add Resource"
              onClick={handleAddResource}
              buttonColor="bg-purple-600"
              radius="rounded-md"
            />
            <CustomButton
              buttonText="Cancel"
              onClick={() => setShowAddResource(false)}
              buttonColor="bg-gray-300"
              textColor="text-gray-700"
              radius="rounded-md"
            />
          </div>
        </div>
      )}

      {resources.length === 0 && !showAddResource && (
        <div className="text-center py-8 text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>
            No resources added yet. Click "Add Resource" to upload files for
            your guests.
          </p>
        </div>
      )}
    </div>
  );
};
