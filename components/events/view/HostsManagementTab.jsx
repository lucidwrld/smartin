"use client";

import React, { useState } from "react";
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

const HostsManagementTab = ({ event }) => {
  const [hosts, setHosts] = useState(event?.hosts || []);
  const [showModal, setShowModal] = useState(false);
  const [editingHost, setEditingHost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    image: "",
    organization: "",
    email: "",
    phone: "",
    social_links: {
      website: "",
      linkedin: "",
      twitter: "",
      instagram: "",
      facebook: ""
    },
    expertise_areas: "",
    role_type: "host"
  });

  const roleTypes = [
    { value: "host", label: "Host" },
    { value: "co-host", label: "Co-Host" },
    { value: "special_guest", label: "Special Guest" },
    { value: "keynote_speaker", label: "Keynote Speaker" },
    { value: "moderator", label: "Moderator" },
    { value: "organizer", label: "Organizer" }
  ];

  const handleOpenModal = (host = null) => {
    setEditingHost(host);
    
    if (host) {
      setFormData({
        name: host.name || "",
        title: host.title || "",
        bio: host.bio || "",
        image: host.image || "",
        organization: host.organization || "",
        email: host.email || "",
        phone: host.phone || "",
        social_links: {
          website: host.social_links?.website || "",
          linkedin: host.social_links?.linkedin || "",
          twitter: host.social_links?.twitter || "",
          instagram: host.social_links?.instagram || "",
          facebook: host.social_links?.facebook || ""
        },
        expertise_areas: Array.isArray(host.expertise_areas) ? host.expertise_areas.join(", ") : (host.expertise_areas || ""),
        role_type: host.role_type || "host"
      });
    } else {
      setFormData({
        name: "",
        title: "",
        bio: "",
        image: "",
        organization: "",
        email: "",
        phone: "",
        social_links: {
          website: "",
          linkedin: "",
          twitter: "",
          instagram: "",
          facebook: ""
        },
        expertise_areas: "",
        role_type: "host"
      });
    }
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingHost(null);
    setFormData({
      name: "",
      title: "",
      bio: "",
      image: "",
      organization: "",
      email: "",
      phone: "",
      social_links: {
        website: "",
        linkedin: "",
        twitter: "",
        instagram: "",
        facebook: ""
      },
      expertise_areas: "",
      role_type: "host"
    });
  };

  const handleInputChange = (field, value) => {
    if (field.startsWith("social_links.")) {
      const socialField = field.split(".")[1];
      setFormData(prev => ({
        ...prev,
        social_links: {
          ...prev.social_links,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a name");
      return;
    }

    setIsLoading(true);
    
    try {
      const newHost = {
        id: editingHost?.id || `host_${Date.now()}`,
        ...formData,
        expertise_areas: formData.expertise_areas.split(",").map(area => area.trim()).filter(area => area),
        created_at: editingHost?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingHost) {
        setHosts(prev => 
          prev.map(host => host.id === editingHost.id ? newHost : host)
        );
      } else {
        setHosts(prev => [...prev, newHost]);
      }

      // Here you would typically save to backend
      // await updateEventHosts({
      //   eventId: event.id,
      //   hosts: editingHost ? hosts.map(...) : [...hosts, newHost]
      // });

      handleCloseModal();
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (hostId) => {
    if (!confirm("Are you sure you want to delete this host?")) {
      return;
    }

    try {
      setHosts(prev => prev.filter(host => host.id !== hostId));

      // Here you would typically delete from backend
      // await deleteEventHost({ eventId: event.id, hostId });
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error deleting. Please try again.");
    }
  };

  const getRoleColor = (roleType) => {
    const colors = {
      host: "bg-purple-100 text-purple-800",
      "co-host": "bg-blue-100 text-blue-800",
      special_guest: "bg-yellow-100 text-yellow-800",
      keynote_speaker: "bg-green-100 text-green-800",
      moderator: "bg-gray-100 text-gray-800",
      organizer: "bg-pink-100 text-pink-800"
    };
    return colors[roleType] || "bg-gray-100 text-gray-800";
  };

  const getRoleIcon = (roleType) => {
    switch (roleType) {
      case "keynote_speaker":
      case "special_guest":
        return <Crown className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getSocialIcon = (platform) => {
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
                      {host.image ? (
                        <img 
                          src={host.image} 
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
                      onClick={() => handleDelete(host.id)}
                      className="p-1 text-gray-500 hover:text-red-600 rounded"
                      title="Delete host"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(host.role_type)}`}>
                    {getRoleIcon(host.role_type)}
                    {roleTypes.find(r => r.value === host.role_type)?.label || host.role_type}
                  </span>
                </div>

                {host.bio && (
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{host.bio}</p>
                )}

                {host.expertise_areas && host.expertise_areas.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Expertise:</p>
                    <div className="flex flex-wrap gap-1">
                      {host.expertise_areas.slice(0, 3).map((area, index) => (
                        <span
                          key={index}
                          className="inline-flex px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                        >
                          {area}
                        </span>
                      ))}
                      {host.expertise_areas.length > 3 && (
                        <span className="text-xs text-gray-500">+{host.expertise_areas.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Social Links */}
                {host.social_links && Object.values(host.social_links).some(link => link) && (
                  <div className="flex items-center gap-2 pt-3 border-t">
                    {Object.entries(host.social_links).map(([platform, url]) => 
                      url && (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 text-gray-500 hover:text-purple-600 rounded"
                          title={`${platform} profile`}
                        >
                          {getSocialIcon(platform)}
                        </a>
                      )
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
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
                      value={formData.role_type}
                      onChange={(e) => handleInputChange("role_type", e.target.value)}
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
                  label="Bio/Description"
                  placeholder="Brief description about this person"
                  isTextArea={true}
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
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

                <InputWithFullBoarder
                  label="Profile Image URL"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                />

                <InputWithFullBoarder
                  label="Expertise Areas"
                  placeholder="Event Management, Public Speaking, Technology (comma-separated)"
                  value={formData.expertise_areas}
                  onChange={(e) => handleInputChange("expertise_areas", e.target.value)}
                />

                {/* Social Links */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Social Links</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputWithFullBoarder
                      label="Website"
                      placeholder="https://example.com"
                      value={formData.social_links.website}
                      onChange={(e) => handleInputChange("social_links.website", e.target.value)}
                    />
                    
                    <InputWithFullBoarder
                      label="LinkedIn"
                      placeholder="https://linkedin.com/in/username"
                      value={formData.social_links.linkedin}
                      onChange={(e) => handleInputChange("social_links.linkedin", e.target.value)}
                    />
                    
                    <InputWithFullBoarder
                      label="Twitter"
                      placeholder="https://twitter.com/username"
                      value={formData.social_links.twitter}
                      onChange={(e) => handleInputChange("social_links.twitter", e.target.value)}
                    />
                    
                    <InputWithFullBoarder
                      label="Instagram"
                      placeholder="https://instagram.com/username"
                      value={formData.social_links.instagram}
                      onChange={(e) => handleInputChange("social_links.instagram", e.target.value)}
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
    </div>
  );
};

export default HostsManagementTab;