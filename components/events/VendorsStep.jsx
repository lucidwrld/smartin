import React, { useState } from "react";
import { Plus, Trash2, Phone, Mail, Globe, Edit2 } from "lucide-react";
import InputWithFullBoarder from "../InputWithFullBoarder";
import CustomButton from "../Button";

export const VendorsStep = ({ formData, onFormDataChange }) => {
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [newVendor, setNewVendor] = useState({
    name: "",
    service_type: "",
    contact_person: "",
    phone: "",
    email: "",
    description: "",
    website: "",
    is_public: true,
  });

  const vendors = formData.vendors || [];

  const serviceTypes = [
    { value: "catering", label: "Catering" },
    { value: "photography", label: "Photography" },
    { value: "videography", label: "Videography" },
    { value: "music_dj", label: "Music & DJ" },
    { value: "decoration", label: "Decoration" },
    { value: "flowers", label: "Flowers" },
    { value: "transportation", label: "Transportation" },
    { value: "venue", label: "Venue" },
    { value: "security", label: "Security" },
    { value: "av_equipment", label: "AV Equipment" },
    { value: "entertainment", label: "Entertainment" },
    { value: "planning", label: "Event Planning" },
    { value: "other", label: "Other" },
  ];

  const handleAddVendor = () => {
    if (!newVendor.name.trim()) {
      alert("Please enter vendor name");
      return;
    }

    if (!newVendor.service_type) {
      alert("Please select a service type");
      return;
    }

    const vendorToAdd = {
      id: `vendor_${Date.now()}`,
      ...newVendor,
    };

    const updatedVendors = [...vendors, vendorToAdd];
    onFormDataChange("vendors", updatedVendors);

    setNewVendor({
      name: "",
      service_type: "",
      contact_person: "",
      phone: "",
      email: "",
      description: "",
      website: "",
      is_public: true,
    });
    setShowAddVendor(false);
  };

  const handleRemoveVendor = (vendorId) => {
    const updatedVendors = vendors.filter((vendor) => vendor.id !== vendorId);
    onFormDataChange("vendors", updatedVendors);
  };

  const handleVendorChange = (vendorId, field, value) => {
    const updatedVendors = vendors.map((vendor) =>
      vendor.id === vendorId ? { ...vendor, [field]: value } : vendor
    );
    onFormDataChange("vendors", updatedVendors);
  };

  const getServiceTypeLabel = (serviceType) => {
    const service = serviceTypes.find((s) => s.value === serviceType);
    return service ? service.label : serviceType;
  };

  const getServiceIcon = (serviceType) => {
    const icons = {
      catering: "🍽️",
      photography: "📸",
      videography: "🎥",
      music_dj: "🎵",
      decoration: "🎨",
      flowers: "🌸",
      transportation: "🚗",
      venue: "🏢",
      security: "🛡️",
      av_equipment: "🎤",
      entertainment: "🎭",
      planning: "📋",
      other: "⚙️",
    };
    return icons[serviceType] || "⚙️";
  };

  return (
    <div className="flex flex-col w-full text-brandBlack">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Event Vendors</h2>
        <p className="text-gray-600">
          Add vendors and service providers for your event. Guests can view this
          directory to contact service providers or understand who's involved in
          making the event special.
        </p>
      </div>

      {/* Existing Vendors */}
      <div className="space-y-4 mb-6">
        {vendors.map((vendor, index) => (
          <div key={vendor.id} className="border rounded-lg p-4 bg-white">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-start gap-3 flex-1">
                <div className="text-2xl">
                  {getServiceIcon(vendor.service_type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-lg">{vendor.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {getServiceTypeLabel(vendor.service_type)}
                    </span>
                    {vendor.is_public && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
                        Public
                      </span>
                    )}
                  </div>

                  {vendor.contact_person && (
                    <p className="text-sm text-gray-600 mb-1">
                      Contact: {vendor.contact_person}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {vendor.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {vendor.phone}
                      </div>
                    )}
                    {vendor.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {vendor.email}
                      </div>
                    )}
                    {vendor.website && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        <a
                          href={vendor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-800"
                        >
                          Website
                        </a>
                      </div>
                    )}
                  </div>

                  {vendor.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      {vendor.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setEditingVendor(
                      editingVendor === vendor.id ? null : vendor.id
                    )
                  }
                  className="text-blue-500 hover:text-blue-700 p-1"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleRemoveVendor(vendor.id)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Quick Edit Form */}
            {editingVendor === vendor.id && (
              <div className="border-t pt-4 mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Vendor Name"
                    value={vendor.name}
                    onChange={(e) =>
                      handleVendorChange(vendor.id, "name", e.target.value)
                    }
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Type
                    </label>
                    <select
                      value={vendor.service_type}
                      onChange={(e) =>
                        handleVendorChange(
                          vendor.id,
                          "service_type",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="">Select service type</option>
                      {serviceTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Contact Person"
                    value={vendor.contact_person}
                    onChange={(e) =>
                      handleVendorChange(
                        vendor.id,
                        "contact_person",
                        e.target.value
                      )
                    }
                  />
                  <InputWithFullBoarder
                    label="Phone"
                    value={vendor.phone}
                    onChange={(e) =>
                      handleVendorChange(vendor.id, "phone", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Email"
                    type="email"
                    value={vendor.email}
                    onChange={(e) =>
                      handleVendorChange(vendor.id, "email", e.target.value)
                    }
                  />
                  <InputWithFullBoarder
                    label="Website"
                    value={vendor.website}
                    onChange={(e) =>
                      handleVendorChange(vendor.id, "website", e.target.value)
                    }
                    placeholder="https://..."
                  />
                </div>

                <InputWithFullBoarder
                  label="Description"
                  isTextArea={true}
                  rows={2}
                  value={vendor.description}
                  onChange={(e) =>
                    handleVendorChange(vendor.id, "description", e.target.value)
                  }
                />

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={vendor.is_public}
                    onChange={(e) =>
                      handleVendorChange(
                        vendor.id,
                        "is_public",
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-700">
                    Display in public vendor directory
                  </label>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Vendor Button */}
      {!showAddVendor && (
        <button
          onClick={() => setShowAddVendor(true)}
          className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Vendor
        </button>
      )}

      {/* Add Vendor Form */}
      {showAddVendor && (
        <div className="border-2 border-purple-200 rounded-lg p-6 bg-purple-50">
          <h3 className="font-medium text-lg mb-4">Add New Vendor</h3>

          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithFullBoarder
                label="Vendor Name *"
                value={newVendor.name}
                onChange={(e) =>
                  setNewVendor({ ...newVendor, name: e.target.value })
                }
                placeholder="e.g., Delicious Catering Co."
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type *
                </label>
                <select
                  value={newVendor.service_type}
                  onChange={(e) =>
                    setNewVendor({ ...newVendor, service_type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select service type</option>
                  {serviceTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithFullBoarder
                label="Contact Person"
                value={newVendor.contact_person}
                onChange={(e) =>
                  setNewVendor({ ...newVendor, contact_person: e.target.value })
                }
                placeholder="Primary contact name"
              />

              <InputWithFullBoarder
                label="Phone"
                value={newVendor.phone}
                onChange={(e) =>
                  setNewVendor({ ...newVendor, phone: e.target.value })
                }
                placeholder="+1234567890"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithFullBoarder
                label="Email"
                type="email"
                value={newVendor.email}
                onChange={(e) =>
                  setNewVendor({ ...newVendor, email: e.target.value })
                }
                placeholder="contact@vendor.com"
              />

              <InputWithFullBoarder
                label="Website"
                value={newVendor.website}
                onChange={(e) =>
                  setNewVendor({ ...newVendor, website: e.target.value })
                }
                placeholder="https://vendor.com"
              />
            </div>

            <InputWithFullBoarder
              label="Description"
              isTextArea={true}
              rows={3}
              value={newVendor.description}
              onChange={(e) =>
                setNewVendor({ ...newVendor, description: e.target.value })
              }
              placeholder="Brief description of services provided"
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newVendor.is_public}
                onChange={(e) =>
                  setNewVendor({ ...newVendor, is_public: e.target.checked })
                }
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">
                Display this vendor in the public directory for guests to see
              </label>
            </div>
          </div>

          <div className="flex gap-3">
            <CustomButton
              buttonText="Add Vendor"
              onClick={handleAddVendor}
              buttonColor="bg-purple-600"
              radius="rounded-md"
            />
            <CustomButton
              buttonText="Cancel"
              onClick={() => setShowAddVendor(false)}
              buttonColor="bg-gray-300"
              textColor="text-gray-700"
              radius="rounded-md"
            />
          </div>
        </div>
      )}

      {vendors.length === 0 && !showAddVendor && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">🤝</div>
          <p>
            No vendors added yet. Click "Add Vendor" to start building your
            vendor directory.
          </p>
        </div>
      )}
    </div>
  );
};
