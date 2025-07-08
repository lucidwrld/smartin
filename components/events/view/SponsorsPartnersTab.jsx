"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Crown,
  Building2,
  Save,
  X,
  Upload,
  Link
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import { AddSponsorsManager, UpdateSponsorsManager, DeleteSponsorsManager, AddPartnersManager, UpdatePartnersManager, DeletePartnersManager } from "@/app/events/controllers/eventManagementController";

const SponsorsPartnersTab = ({ event }) => {
  const [activeTab, setActiveTab] = useState("sponsors");
  const [sponsors, setSponsors] = useState(event?.sponsors || []);
  const [partners, setPartners] = useState(event?.partners || []);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState("sponsor"); // sponsor or partner

  // Controllers
  const { addSponsors, isLoading: addingSponsors } = AddSponsorsManager();
  const { updateSponsors, isLoading: updatingSponsors } = UpdateSponsorsManager();
  const { deleteSponsors, isLoading: deletingSponsors } = DeleteSponsorsManager();
  const { addPartners, isLoading: addingPartners } = AddPartnersManager();
  const { updatePartners, isLoading: updatingPartners } = UpdatePartnersManager();
  const { deletePartners, isLoading: deletingPartners } = DeletePartnersManager();

  const isLoading = addingSponsors || updatingSponsors || deletingSponsors || addingPartners || updatingPartners || deletingPartners;

  const [formData, setFormData] = useState({
    name: "",
    website: "",
    logo: "",
    description: "",
    tier: "bronze", // for sponsors
    partnership_type: "general", // for partners
    contact_person: "",
    contact_email: "",
    contribution: ""
  });

  const sponsorTiers = [
    { value: "platinum", label: "Platinum", color: "bg-gray-300" },
    { value: "gold", label: "Gold", color: "bg-yellow-400" },
    { value: "silver", label: "Silver", color: "bg-gray-200" },
    { value: "bronze", label: "Bronze", color: "bg-orange-400" }
  ];

  const partnershipTypes = [
    { value: "general", label: "General Partner" },
    { value: "media", label: "Media Partner" },
    { value: "technology", label: "Technology Partner" },
    { value: "strategic", label: "Strategic Partner" },
    { value: "community", label: "Community Partner" },
    { value: "venue", label: "Venue Partner" }
  ];

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    
    if (item) {
      setFormData({
        name: item.name || "",
        website: item.website || "",
        logo: item.logo || "",
        description: item.description || "",
        tier: item.tier || "bronze",
        partnership_type: item.partnership_type || "general",
        contact_person: item.contact_person || "",
        contact_email: item.contact_email || "",
        contribution: item.contribution || ""
      });
    } else {
      setFormData({
        name: "",
        website: "",
        logo: "",
        description: "",
        tier: "bronze",
        partnership_type: "general",
        contact_person: "",
        contact_email: "",
        contribution: ""
      });
    }
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({
      name: "",
      website: "",
      logo: "",
      description: "",
      tier: "bronze",
      partnership_type: "general",
      contact_person: "",
      contact_email: "",
      contribution: ""
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Please enter a name");
      return;
    }
    
    try {
      if (modalType === "sponsor") {
        // Include ALL frontend data points, even if backend doesn't support them yet
        const sponsorData = {
          // Backend-supported fields
          name: formData.name,
          logo: formData.logo,
          website: formData.website,
          description: formData.description,
          sponsorship_tier: formData.tier,
          contact_person: formData.contact_person,
          contact_email: formData.contact_email,
          contribution_benefits: formData.contribution,

          // ADDITIONAL frontend data points backend should support
          tier: formData.tier, // Alternative tier field name
          contribution: formData.contribution, // Alternative contribution field name
        };

        if (editingItem) {
          // Update existing sponsor
          const updatedSponsors = sponsors.map(item => 
            item.id === editingItem.id ? { ...item, ...sponsorData } : item
          );
          await updateSponsors(event.id, updatedSponsors);
          setSponsors(updatedSponsors);
        } else {
          // Add new sponsor
          const newSponsors = [...sponsors, { id: `sponsor_${Date.now()}`, ...sponsorData }];
          await addSponsors(event.id, [sponsorData]);
          setSponsors(newSponsors);
        }
      } else {
        // Include ALL frontend data points, even if backend doesn't support them yet
        const partnerData = {
          // Backend-supported fields (note: descritpion is misspelled in backend)
          name: formData.name,
          description: formData.description,
          descritpion: formData.description, // Backend's misspelled field
          logo: formData.logo,
          website: formData.website,
          contact_person: formData.contact_person,
          contact_email: formData.contact_email,
          partnership_type: formData.partnership_type,
          details: formData.contribution,

          // ADDITIONAL frontend data points backend should support
          contribution: formData.contribution, // Alternative details field name
        };

        if (editingItem) {
          // Update existing partner
          const updatedPartners = partners.map(item => 
            item.id === editingItem.id ? { ...item, ...partnerData } : item
          );
          await updatePartners(event.id, updatedPartners);
          setPartners(updatedPartners);
        } else {
          // Add new partner
          const newPartners = [...partners, { id: `partner_${Date.now()}`, ...partnerData }];
          await addPartners(event.id, [partnerData]);
          setPartners(newPartners);
        }
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving. Please try again.");
    }
  };

  const handleDelete = async (type, itemId) => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      if (type === "sponsor") {
        await deleteSponsors(event.id, [itemId]);
        setSponsors(prev => prev.filter(item => item.id !== itemId));
      } else {
        await deletePartners(event.id, [itemId]);
        setPartners(prev => prev.filter(item => item.id !== itemId));
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error deleting. Please try again.");
    }
  };

  const getTierColor = (tier) => {
    const tierData = sponsorTiers.find(t => t.value === tier);
    return tierData?.color || "bg-gray-200";
  };

  const tabs = [
    { id: "sponsors", label: "Sponsors", icon: Crown, count: sponsors.length },
    { id: "partners", label: "Partners", icon: Building2, count: partners.length }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Sponsors & Partners</h2>
          <p className="text-gray-600">
            Manage your event sponsors and partnership relationships
          </p>
        </div>
        
        <div className="flex gap-2">
          <CustomButton
            buttonText="Add Sponsor"
            prefixIcon={<Plus className="w-4 h-4" />}
            buttonColor="bg-yellow-600"
            radius="rounded-md"
            onClick={() => handleOpenModal("sponsor")}
          />
          <CustomButton
            buttonText="Add Partner"
            prefixIcon={<Plus className="w-4 h-4" />}
            buttonColor="bg-blue-600"
            radius="rounded-md"
            onClick={() => handleOpenModal("partner")}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count > 0 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === "sponsors" && (
        <div className="space-y-4">
          {sponsors.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Crown className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sponsors yet</h3>
              <p className="text-gray-500 mb-4">
                Add sponsors who are supporting your event
              </p>
              <CustomButton
                buttonText="Add First Sponsor"
                prefixIcon={<Plus className="w-4 h-4" />}
                buttonColor="bg-yellow-600"
                radius="rounded-md"
                onClick={() => handleOpenModal("sponsor")}
              />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Crown className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{sponsor.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-gray-800 ${getTierColor(sponsor.tier)}`}>
                          {sponsor.tier?.charAt(0).toUpperCase() + sponsor.tier?.slice(1)} Tier
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenModal("sponsor", sponsor)}
                        className="p-1 text-gray-500 hover:text-blue-600 rounded"
                        title="Edit sponsor"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete("sponsor", sponsor.id)}
                        className="p-1 text-gray-500 hover:text-red-600 rounded"
                        title="Delete sponsor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {sponsor.description && (
                    <p className="text-gray-600 text-sm mb-3">{sponsor.description}</p>
                  )}

                  {sponsor.contribution && (
                    <p className="text-gray-500 text-xs mb-3">
                      <strong>Contribution:</strong> {sponsor.contribution}
                    </p>
                  )}

                  <div className="space-y-2">
                    {sponsor.contact_person && (
                      <p className="text-xs text-gray-500">
                        <strong>Contact:</strong> {sponsor.contact_person}
                      </p>
                    )}
                    
                    {sponsor.website && (
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:underline"
                      >
                        Visit Website
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "partners" && (
        <div className="space-y-4">
          {partners.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No partners yet</h3>
              <p className="text-gray-500 mb-4">
                Add organizations that are partnering with your event
              </p>
              <CustomButton
                buttonText="Add First Partner"
                prefixIcon={<Plus className="w-4 h-4" />}
                buttonColor="bg-blue-600"
                radius="rounded-md"
                onClick={() => handleOpenModal("partner")}
              />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {partners.map((partner) => (
                <div
                  key={partner.id}
                  className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{partner.name}</h3>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {partnershipTypes.find(t => t.value === partner.partnership_type)?.label || partner.partnership_type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenModal("partner", partner)}
                        className="p-1 text-gray-500 hover:text-blue-600 rounded"
                        title="Edit partner"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete("partner", partner.id)}
                        className="p-1 text-gray-500 hover:text-red-600 rounded"
                        title="Delete partner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {partner.description && (
                    <p className="text-gray-600 text-sm mb-3">{partner.description}</p>
                  )}

                  {partner.contribution && (
                    <p className="text-gray-500 text-xs mb-3">
                      <strong>Partnership:</strong> {partner.contribution}
                    </p>
                  )}

                  <div className="space-y-2">
                    {partner.contact_person && (
                      <p className="text-xs text-gray-500">
                        <strong>Contact:</strong> {partner.contact_person}
                      </p>
                    )}
                    
                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:underline"
                      >
                        Visit Website
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {modalType === "sponsor" ? <Crown className="w-5 h-5 text-yellow-600" /> : <Building2 className="w-5 h-5 text-blue-600" />}
                  {editingItem ? `Edit ${modalType}` : `Add New ${modalType}`}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label={`${modalType === "sponsor" ? "Sponsor" : "Partner"} Name *`}
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    isRequired={true}
                  />
                  
                  <InputWithFullBoarder
                    label="Website URL"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                  />
                </div>

                <InputWithFullBoarder
                  label="Description"
                  placeholder="Brief description of the partnership/sponsorship"
                  isTextArea={true}
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modalType === "sponsor" ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sponsorship Tier
                      </label>
                      <select
                        value={formData.tier}
                        onChange={(e) => handleInputChange("tier", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      >
                        {sponsorTiers.map((tier) => (
                          <option key={tier.value} value={tier.value}>
                            {tier.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Partnership Type
                      </label>
                      <select
                        value={formData.partnership_type}
                        onChange={(e) => handleInputChange("partnership_type", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      >
                        {partnershipTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <InputWithFullBoarder
                    label="Logo URL"
                    placeholder="https://example.com/logo.png"
                    value={formData.logo}
                    onChange={(e) => handleInputChange("logo", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Contact Person"
                    placeholder="John Smith"
                    value={formData.contact_person}
                    onChange={(e) => handleInputChange("contact_person", e.target.value)}
                  />
                  
                  <InputWithFullBoarder
                    label="Contact Email"
                    type="email"
                    placeholder="contact@example.com"
                    value={formData.contact_email}
                    onChange={(e) => handleInputChange("contact_email", e.target.value)}
                  />
                </div>

                <InputWithFullBoarder
                  label={modalType === "sponsor" ? "Contribution/Benefits" : "Partnership Details"}
                  placeholder={modalType === "sponsor" ? "What are they providing or receiving?" : "What does this partnership involve?"}
                  isTextArea={true}
                  rows={2}
                  value={formData.contribution}
                  onChange={(e) => handleInputChange("contribution", e.target.value)}
                />

                <div className="flex gap-3 pt-4">
                  <CustomButton
                    buttonText={editingItem ? "Update" : "Add"} 
                    prefixIcon={<Save className="w-4 h-4" />}
                    buttonColor={modalType === "sponsor" ? "bg-yellow-600" : "bg-blue-600"}
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

export default SponsorsPartnersTab;