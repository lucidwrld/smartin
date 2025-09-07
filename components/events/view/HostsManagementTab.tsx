"use client";

import React, { useEffect, useState } from "react";
import { Event, Host } from "@/app/events/types";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Crown,
  Save,
  X,
  Upload,
  Link,
  User,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Facebook
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import ImageUploader from "@/components/ImageUploader";
import { AddHostsManager, UpdateHostsManager, DeleteHostsManager } from "@/app/events/controllers/eventManagementController";
import useFileUpload from "@/utils/fileUploadController";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

interface HostsManagementTabProps {
  event: Event;
  refetch: () => void;
}

interface HostFormData {
  name: string;
  title: string;
  organization: string;
  email: string;
  phone: string;
  profile_image: string;
  description: string;
  areas_of_expertise: string;
  website: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  role: string;
}

const HostsManagementTab: React.FC<HostsManagementTabProps> = ({ event, refetch }) => {
  // Get data directly from event prop - no local storage
  const hosts: Host[] = event?.hosts || [];
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingHost, setEditingHost] = useState<Host | null>(null);
  const [selectedId, setSelectedId] = useState(null)
  // Controllers
  const { addHosts, isLoading: adding, isSuccess: addSuccess } = AddHostsManager();
  const { updateHosts, isLoading: updating, isSuccess: updateSuccess } = UpdateHostsManager();
  const { deleteHosts, isLoading: deleting, isSuccess: deleteSuccess } = DeleteHostsManager();

  useEffect(() => {
     if(addSuccess){
        refetch()
        handleCloseModal();
      }
      if(updateSuccess){
        refetch()
        handleCloseModal();
      }
      if(deleteSuccess){
        refetch()
        typeof document !== "undefined" && document.getElementById("delete").close()
      }

  }, [addSuccess, updateSuccess, deleteSuccess])
  // File upload hook for profile image uploads
  const {
    handleFileUpload: uploadFile,
    isLoading: uploadingFile,
    progress: uploadProgress,
    error: uploadError,
  } = useFileUpload();

  const [imageUploadMode, setImageUploadMode] = useState<"url" | "upload">("url");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

  const isLoading = adding || updating || deleting || uploadingFile;

  const [formData, setFormData] = useState<HostFormData>({
    name: "",
    title: "",
    organization: "",
    email: "",
    phone: "",
    profile_image: "",
    description: "",
    areas_of_expertise: "",
    website: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    role: "host",
  });

  const roleTypes = [
    { value: "host", label: "Host" },
    { value: "co-host", label: "Co-Host" },
    { value: "special_guest", label: "Special Guest" },
    { value: "keynote_speaker", label: "Keynote Speaker" },
    { value: "moderator", label: "Moderator" },
    { value: "organizer", label: "Organizer" }
  ];

  const handleOpenModal = (host: Host | null = null): void => {
    setEditingHost(host);
    
    if (host) {
      setFormData({
        name: host.name || "",
        title: host.title || "",
        organization: host.organization || "",
        email: host.email || "",
        phone: host.phone || "",
        profile_image: host.profile_image || "",
        description: host.description || "",
        areas_of_expertise: host.areas_of_expertise || "",
        website: host.website || "",
        linkedin: host.linkedin || "",
        twitter: host.twitter || "",
        instagram: host.instagram || "",
        role: host.role || "host",
      });
    } else {
      setFormData({
        name: "",
        title: "",
        organization: "",
        email: "",
        phone: "",
        profile_image: "",
        description: "",
        areas_of_expertise: "",
        website: "",
        linkedin: "",
        twitter: "",
        instagram: "",
        role: "host",
      });
    }
    
    setShowModal(true);
  };

  const handleImageFileSelect = (file: File | null): void => {
    if (!file) {
      // Handle image removal
      setSelectedImageFile(null);
      setFormData(prev => ({ ...prev, profile_image: "" }));
      return;
    }

    // Just capture the file, don't upload yet
    setSelectedImageFile(file);
    
    // Create preview URL for display
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({ ...prev, profile_image: previewUrl }));
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
    setEditingHost(null);
    setImageUploadMode("url");
    setSelectedImageFile(null);
    setFormData({
      name: "",
      title: "",
      organization: "",
      email: "",
      phone: "",
      profile_image: "",
      description: "",
      areas_of_expertise: "",
      website: "",
      linkedin: "",
      twitter: "",
      instagram: "",
      role: "host",
    });
  };

  const handleInputChange = (field: keyof HostFormData, value: string): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async (): Promise<void> => {
    if (!formData.name.trim()) {
      alert("Please enter a name");
      return;
    }
    
    try {
      let imageUrl = formData.profile_image;

      // If there's a selected file and we're in upload mode, upload it first
      if (selectedImageFile && imageUploadMode === "upload") {
        imageUrl = await uploadFile(selectedImageFile);
      }

      if (editingHost) {
        // For update, only send the changed fields
        const changedFields: any = {};
        
        // Compare each field and only include if changed
        Object.keys(formData).forEach((key) => {
          const formKey = key as keyof HostFormData;
          const newValue = formKey === 'profile_image' ? imageUrl : formData[formKey];
          if (newValue !== editingHost[formKey]) {
            changedFields[formKey] = newValue;
          }
        });

        // Update existing host with only changed fields
        await updateHosts(event.id, editingHost.id, changedFields);
      } else {
        // Add new host - send all fields
        const hostData = {
          name: formData.name,
          title: formData.title,
          organization: formData.organization,
          email: formData.email,
          phone: formData.phone,
          profile_image: imageUrl,
          description: formData.description,
          areas_of_expertise: formData.areas_of_expertise,
          website: formData.website,
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          instagram: formData.instagram,
          role: formData.role,
        };
        
        await addHosts(event.id, [hostData]);
      }
 
    } catch (error) {
      console.error("Error saving host:", error);
      alert("Error saving host. Please try again.");
    }
  };

  const handleDelete = async (hostId: string): Promise<void> => {
    if (!confirm("Are you sure you want to delete this host?")) {
      return;
    }

    try {
      await deleteHosts(event.id, [hostId]);
    } catch (error) {
      console.error("Error deleting host:", error);
      alert("Error deleting host. Please try again.");
    }
  };

  const getRoleColor = (roleType: string): string => {
    const colors: Record<string, string> = {
      host: "bg-purple-100 text-purple-800",
      "co-host": "bg-blue-100 text-blue-800",
      special_guest: "bg-yellow-100 text-yellow-800",
      keynote_speaker: "bg-green-100 text-green-800",
      moderator: "bg-gray-100 text-gray-800",
      organizer: "bg-pink-100 text-pink-800"
    };
    return colors[roleType] || "bg-gray-100 text-gray-800";
  };

  const getRoleIcon = (roleType: string): JSX.Element => {
    switch (roleType) {
      case "keynote_speaker":
      case "special_guest":
        return <Crown className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getSocialIcon = (platform: string): JSX.Element => {
    switch (platform) {
      case "linkedin":
        return <Linkedin className="w-4 h-4" />;
      case "twitter":
        return <Twitter className="w-4 h-4" />;
      case "instagram":
        return <Instagram className="w-4 h-4" />;
      case "facebook":
        return <Facebook className="w-4 h-4" />;
      case "website":
        return <Globe className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Hosts & Important Figures</h2>
          <p className="text-gray-600">
            Manage the key people hosting and presenting at your event
          </p>
        </div>
        
        <CustomButton
          buttonText="Add Host"
          prefixIcon={<Plus className="w-4 h-4" />}
          buttonColor="bg-purple-600"
          radius="rounded-md"
          onClick={() => handleOpenModal()}
        />
      </div>

      {/* Content */}
      <div className="space-y-4">
        {hosts.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hosts added yet</h3>
            <p className="text-gray-500 mb-4">
              Add the key people who will be hosting or presenting at your event
            </p>
            <CustomButton
              buttonText="Add First Host"
              prefixIcon={<Plus className="w-4 h-4" />}
              buttonColor="bg-purple-600"
              radius="rounded-md"
              onClick={() => handleOpenModal()}
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hosts.map((host) => (
              <div
                key={host.id}
                className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center overflow-hidden">
                      {host.profile_image ? (
                        <img 
                          src={host.profile_image} 
                          alt={host.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-purple-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{host.name}</h3>
                      <p className="text-sm text-gray-600">{host.title}</p>
                      {host.organization && (
                        <p className="text-xs text-gray-500">{host.organization}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(host)}
                      className="p-1 text-gray-500 hover:text-blue-600 rounded"
                      title="Edit host"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {setSelectedId(host.id); typeof document !== "undefined" && document.getElementById("delete").showModal()}}
                      className="p-1 text-gray-500 hover:text-red-600 rounded"
                      title="Delete host"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(host.role)}`}>
                    {getRoleIcon(host.role)}
                    {roleTypes.find(r => r.value === host.role)?.label || host.role}
                  </span>
                </div>

                {host.description && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{host.description}</p>
                )}

                {host.areas_of_expertise && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Expertise:</p>
                    <span className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {host.areas_of_expertise}
                    </span>
                  </div>
                )}

                {/* Social Links */}
                {(host.website || host.linkedin || host.twitter || host.instagram) && (
                  <div className="flex items-center gap-2 pt-3 border-t">
                    {host.website && (
                      <a
                        href={host.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-gray-500 hover:text-purple-600 rounded"
                        title="Website"
                      >
                        {getSocialIcon("website")}
                      </a>
                    )}
                    {host.linkedin && (
                      <a
                        href={host.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-gray-500 hover:text-purple-600 rounded"
                        title="LinkedIn profile"
                      >
                        {getSocialIcon("linkedin")}
                      </a>
                    )}
                    {host.twitter && (
                      <a
                        href={host.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-gray-500 hover:text-purple-600 rounded"
                        title="Twitter profile"
                      >
                        {getSocialIcon("twitter")}
                      </a>
                    )}
                    {host.instagram && (
                      <a
                        href={host.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-gray-500 hover:text-purple-600 rounded"
                        title="Instagram profile"
                      >
                        {getSocialIcon("instagram")}
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 !mt-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  {editingHost ? "Edit Host" : "Add New Host"}
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
                    label="Full Name *"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    isRequired={true}
                  />
                  
                  <InputWithFullBoarder
                    label="Title/Position"
                    placeholder="CEO, Director, etc."
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Organization"
                    placeholder="Company or organization name"
                    value={formData.organization}
                    onChange={(e) => handleInputChange("organization", e.target.value)}
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role Type
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => handleInputChange("role", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    >
                      {roleTypes.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <InputWithFullBoarder
                  label="Description"
                  placeholder="Brief description about this person"
                  isTextArea={true}
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Email"
                    type="email"
                    placeholder="contact@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                  
                  <InputWithFullBoarder
                    label="Phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                  </label>
                  
                  {/* Upload Mode Toggle */}
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setImageUploadMode("url")}
                      className={`px-3 py-1 text-xs rounded ${
                        imageUploadMode === "url"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      <Link className="w-3 h-3 inline mr-1" />
                      URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadMode("upload")}
                      className={`px-3 py-1 text-xs rounded ${
                        imageUploadMode === "upload"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      <Upload className="w-3 h-3 inline mr-1" />
                      Upload
                    </button>
                  </div>

                  {imageUploadMode === "url" ? (
                    <InputWithFullBoarder
                      placeholder="https://example.com/image.jpg"
                      value={formData.profile_image}
                      onChange={(e) => handleInputChange("profile_image", e.target.value)}
                    />
                  ) : (
                    <div>
                      <ImageUploader
                        onImageChange={handleImageFileSelect}
                        currentImage={formData.profile_image}
                        height="h-32"
                        label="Drop profile image here or click to browse"
                        acceptedFormats="PNG, JPG, GIF or SVG"
                      />
                      {uploadingFile && (
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Uploading... {uploadProgress}%
                          </p>
                        </div>
                      )}
                      {uploadError && (
                        <p className="text-xs text-red-500 mt-1">
                          {uploadError}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <InputWithFullBoarder
                  label="Areas of Expertise"
                  placeholder="Event Management, Public Speaking, Technology"
                  value={formData.areas_of_expertise}
                  onChange={(e) => handleInputChange("areas_of_expertise", e.target.value)}
                />

                {/* Social Links */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Social Links</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputWithFullBoarder
                      label="Website"
                      placeholder="https://example.com"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                    />
                    
                    <InputWithFullBoarder
                      label="LinkedIn"
                      placeholder="https://linkedin.com/in/username"
                      value={formData.linkedin}
                      onChange={(e) => handleInputChange("linkedin", e.target.value)}
                    />
                    
                    <InputWithFullBoarder
                      label="Twitter"
                      placeholder="https://twitter.com/username"
                      value={formData.twitter}
                      onChange={(e) => handleInputChange("twitter", e.target.value)}
                    />
                    
                    <InputWithFullBoarder
                      label="Instagram"
                      placeholder="https://instagram.com/username"
                      value={formData.instagram}
                      onChange={(e) => handleInputChange("instagram", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <CustomButton
                    buttonText={editingHost ? "Update Host" : "Add Host"} 
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
      <DeleteConfirmationModal id={"delete"} successFul={false} title={`Delete Host`} isLoading={deleting} buttonColor={"bg-red-500"} buttonText={"Delete"} body={`Are you sure you want to delete this host?`} 
      onClick={async () => { 
         try {
          await deleteHosts(event.id, [selectedId]);
        } catch (error) {
          console.error("Error deleting host:", error);
          alert("Error deleting host. Please try again.");
        }
      } 
      }
      />
    </div>
  );
};

export default HostsManagementTab;