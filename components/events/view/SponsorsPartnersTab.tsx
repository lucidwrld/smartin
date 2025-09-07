"use client";

import React, { useEffect, useState } from "react";
import { Event, Sponsor, Partner } from "@/app/events/types";
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
  Link,
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import ImageUploader from "@/components/ImageUploader";
import {
  AddSponsorsManager,
  UpdateSponsorsManager,
  DeleteSponsorsManager,
  AddPartnersManager,
  UpdatePartnersManager,
  DeletePartnersManager,
} from "@/app/events/controllers/eventManagementController";
import useFileUpload from "@/utils/fileUploadController";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

interface SponsorsPartnersTabProps {
  event: Event;
  refetch: () => void;
}

interface SponsorFormData {
  name: string;
  logo: string;
  website: string;
  description: string;
  sponsorship_tier: string;
  contact_person: string;
  contact_email: string;
  contribution_benefits: string;
}

interface PartnerFormData {
  name: string;
  descritpion: string;
  logo: string;
  website: string;
  contact_person: string;
  contact_email: string;
  partnership_type: string;
  details: string;
}

const SponsorsPartnersTab: React.FC<SponsorsPartnersTabProps> = ({ event, refetch }) => {
  const [activeTab, setActiveTab] = useState<"sponsors" | "partners">(
    "sponsors"
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<Sponsor | Partner | null>(
    null
  );
  const [selectedId, setSelectedId] = useState(null)
  const [selectedType, setSelectedType] = useState(null)
  const [modalType, setModalType] = useState<"sponsor" | "partner">("sponsor");

  // Get data directly from event prop - no local storage
  const sponsors: Sponsor[] = event?.sponsors || [];
  const partners: Partner[] = event?.partners || [];

  // Controllers
  const { addSponsors, isLoading: addingSponsors, isSuccess: addedSponsor } = AddSponsorsManager();
  const { updateSponsors, isLoading: updatingSponsors, isSuccess: updatedSponsor } =
    UpdateSponsorsManager();
  const { deleteSponsors, isLoading: deletingSponsors, isSuccess: deletedSponsor } =
    DeleteSponsorsManager();
  const { addPartners, isLoading: addingPartners, isSuccess: addedPartner } = AddPartnersManager();
  const { updatePartners, isLoading: updatingPartners, isSuccess: updatedPartner } =
    UpdatePartnersManager();
  const { deletePartners, isLoading: deletingPartners, isSuccess: deletedPartner } =
    DeletePartnersManager();

    useEffect(() => {
      if(addedSponsor){
        refetch()
        handleCloseModal();
      }
      if(updatedSponsor){
        refetch()
        handleCloseModal();
      }
      if(deletedSponsor){
        refetch()
        typeof document !== "undefined" && document.getElementById("delete").close()
      }
    }, [addedSponsor, updatedSponsor,
       deletedSponsor
    ])
    useEffect(() => {
      if(addedPartner){
        refetch()
        handleCloseModal();
      }
      if(updatedPartner){
        refetch()
        handleCloseModal();
      }
      if(deletedPartner){
        refetch()
        typeof document !== "undefined" && document.getElementById("delete").close()
      }
    }, [addedPartner, updatedPartner,
       deletedPartner
    ])
  // File upload hook for logo uploads
  const {
    handleFileUpload: uploadFile,
    isLoading: uploadingFile,
    progress: uploadProgress,
    error: uploadError,
  } = useFileUpload();

  const [logoUploadMode, setLogoUploadMode] = useState<"url" | "upload">("url");
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);

  const isLoading =
    addingSponsors ||
    updatingSponsors ||
    deletingSponsors ||
    addingPartners ||
    updatingPartners ||
    deletingPartners ||
    uploadingFile;

  const [sponsorFormData, setSponsorFormData] = useState<SponsorFormData>({
    name: "",
    logo: "",
    website: "",
    description: "",
    sponsorship_tier: "bronze",
    contact_person: "",
    contact_email: "",
    contribution_benefits: "",
  });

  const [partnerFormData, setPartnerFormData] = useState<PartnerFormData>({
    name: "",
    descritpion: "",
    logo: "",
    website: "",
    contact_person: "",
    contact_email: "",
    partnership_type: "General Partner",
    details: "",
  });

  const sponsorTiers = [
    { value: "platinum", label: "Platinum", color: "bg-gray-300" },
    { value: "gold", label: "Gold", color: "bg-yellow-400" },
    { value: "silver", label: "Silver", color: "bg-gray-200" },
    { value: "bronze", label: "Bronze", color: "bg-orange-400" },
  ];

  const partnershipTypes = [
    { value: "General Partner", label: "General Partner" },
    { value: "Media Partner", label: "Media Partner" },
    { value: "Technology Partner", label: "Technology Partner" },
    { value: "Strategic Partner", label: "Strategic Partner" },
    { value: "Community Partner", label: "Community Partner" },
    { value: "Venue Partner", label: "Venue Partner" },
  ];

  const handleOpenModal = (
    type: "sponsor" | "partner",
    item: Sponsor | Partner | null = null
  ): void => {
    setModalType(type);
    setEditingItem(item);

    if (type === "sponsor") {
      if (item) {
        setSponsorFormData({
          name: item.name || "",
          logo: item.logo || "",
          website: item.website || "",
          description: item.description || "",
          sponsorship_tier: item.sponsorship_tier || "bronze",
          contact_person: item.contact_person || "",
          contact_email: item.contact_email || "",
          contribution_benefits: item.contribution_benefits || "",
        });
        // Set upload mode based on existing logo
        setLogoUploadMode(item.logo ? "url" : "url");
      } else {
        setSponsorFormData({
          name: "",
          logo: "",
          website: "",
          description: "",
          sponsorship_tier: "bronze",
          contact_person: "",
          contact_email: "",
          contribution_benefits: "",
        });
        setLogoUploadMode("url");
      }
    } else {
      if (item) {
        setPartnerFormData({
          name: item.name || "",
          descritpion: item.descritpion || "",
          logo: item.logo || "",
          website: item.website || "",
          contact_person: item.contact_person || "",
          contact_email: item.contact_email || "",
          partnership_type: item.partnership_type || "General Partner",
          details: item.details || "",
        });
        // Set upload mode based on existing logo
        setLogoUploadMode(item.logo ? "url" : "url");
      } else {
        setPartnerFormData({
          name: "",
          descritpion: "",
          logo: "",
          website: "",
          contact_person: "",
          contact_email: "",
          partnership_type: "General Partner",
          details: "",
        });
        setLogoUploadMode("url");
      }
    }

    setShowModal(true);
  };

  const handleCloseModal = (): void => {
    setShowModal(false);
    setEditingItem(null);
    setLogoUploadMode("url");
    setSelectedLogoFile(null);
    setSponsorFormData({
      name: "",
      logo: "",
      website: "",
      description: "",
      sponsorship_tier: "bronze",
      contact_person: "",
      contact_email: "",
      contribution_benefits: "",
    });
    setPartnerFormData({
      name: "",
      descritpion: "",
      logo: "",
      website: "",
      contact_person: "",
      contact_email: "",
      partnership_type: "General Partner",
      details: "",
    });
  };

  const handleLogoFileSelect = (file: File | null): void => {
    if (!file) {
      // Handle image removal
      setSelectedLogoFile(null);
      if (modalType === "sponsor") {
        setSponsorFormData((prev) => ({ ...prev, logo: "" }));
      } else {
        setPartnerFormData((prev) => ({ ...prev, logo: "" }));
      }
      return;
    }

    // Just capture the file, don't upload yet
    setSelectedLogoFile(file);

    // Create preview URL for display
    const previewUrl = URL.createObjectURL(file);
    if (modalType === "sponsor") {
      setSponsorFormData((prev) => ({ ...prev, logo: previewUrl }));
    } else {
      setPartnerFormData((prev) => ({ ...prev, logo: previewUrl }));
    }
  };

  const handleInputChange = (field: string, value: string): void => {
    if (modalType === "sponsor") {
      setSponsorFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    } else {
      setPartnerFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSave = async (): Promise<void> => {
    const currentFormData =
      modalType === "sponsor" ? sponsorFormData : partnerFormData;

    if (!currentFormData.name.trim()) {
      alert("Please enter a name");
      return;
    }

    try {
      let logoUrl = currentFormData.logo;

      // If there's a selected file and we're in upload mode, upload it first
      if (selectedLogoFile && logoUploadMode === "upload") {
        logoUrl = await uploadFile(selectedLogoFile);
      }

      if (modalType === "sponsor") {
        if (editingItem) {
          // For update, only send the changed fields
          const changedFields: any = {};
          const editingSponsor = editingItem as Sponsor;
          
          // Create form data with logo URL for comparison
          const currentSponsorData = { ...sponsorFormData, logo: logoUrl };
          
          // Compare each field and only include if changed
          Object.keys(currentSponsorData).forEach((key) => {
            if (currentSponsorData[key] !== editingSponsor[key]) {
              changedFields[key] = currentSponsorData[key];
            }
          });

          // Update existing sponsor with only changed fields
          await updateSponsors(event.id, editingSponsor.id, changedFields);
        } else {
          // Add new sponsor - send all fields
          const sponsorData = {
            name: sponsorFormData.name,
            logo: logoUrl,
            website: sponsorFormData.website,
            description: sponsorFormData.description,
            sponsorship_tier: sponsorFormData.sponsorship_tier,
            contact_person: sponsorFormData.contact_person,
            contact_email: sponsorFormData.contact_email,
            contribution_benefits: sponsorFormData.contribution_benefits,
          };
          
          await addSponsors(event.id, [sponsorData]);
        }
      } else {
        if (editingItem) {
          // For update, only send the changed fields
          const changedFields: any = {};
          const editingPartner = editingItem as Partner;
          
          // Create form data with logo URL for comparison
          const currentPartnerData = { ...partnerFormData, logo: logoUrl };
          
          // Compare each field and only include if changed
          Object.keys(currentPartnerData).forEach((key) => {
            if (currentPartnerData[key] !== editingPartner[key]) {
              changedFields[key] = currentPartnerData[key];
            }
          });

          // Update existing partner with only changed fields
          await updatePartners(event.id, editingPartner.id, changedFields);
        } else {
          // Add new partner - send all fields
          const partnerData = {
            name: partnerFormData.name,
            descritpion: partnerFormData.descritpion,
            logo: logoUrl,
            website: partnerFormData.website,
            contact_person: partnerFormData.contact_person,
            contact_email: partnerFormData.contact_email,
            partnership_type: partnerFormData.partnership_type,
            details: partnerFormData.details,
          };
          
          await addPartners(event.id, [partnerData]);
        }
      }

      
    } catch (error) {
      console.error("Error saving:", error);
      alert("Error saving. Please try again.");
    }
  };

  const handleDelete = async (
    type: "sponsor" | "partner",
    itemId: string
  ): Promise<void> => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return;
    }

    try {
      if (type === "sponsor") {
        await deleteSponsors(event.id, [itemId]);
      } else {
        await deletePartners(event.id, [itemId]);
      }
    } catch (error) {
      console.error("Error deleting:", error);
      alert("Error deleting. Please try again.");
    }
  };

  const getTierColor = (tier: string): string => {
    const tierData = sponsorTiers.find((t) => t.value === tier);
    return tierData?.color || "bg-gray-200";
  };

  const tabs = [
    { id: "sponsors", label: "Sponsors", icon: Crown, count: sponsors.length },
    {
      id: "partners",
      label: "Partners",
      icon: Building2,
      count: partners.length,
    },
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No sponsors yet
              </h3>
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
                        <h3 className="font-semibold text-gray-900">
                          {sponsor.name}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-gray-800 ${getTierColor(
                            sponsor.sponsorship_tier
                          )}`}
                        >
                          {sponsor.sponsorship_tier?.charAt(0).toUpperCase() +
                            sponsor.sponsorship_tier?.slice(1)}{" "}
                          Tier
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
                        onClick={() => {
                          setSelectedType("sponsor")
                          setSelectedId(sponsor.id)
                          typeof document !== "undefined" && document.getElementById("delete").showModal()
                        }}
                        className="p-1 text-gray-500 hover:text-red-600 rounded"
                        title="Delete sponsor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {sponsor.description && (
                    <p className="text-gray-600 text-sm mb-3">
                      {sponsor.description}
                    </p>
                  )}

                  {sponsor.contribution_benefits && (
                    <p className="text-gray-500 text-xs mb-3">
                      <strong>Contribution:</strong> {sponsor.contribution_benefits}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No partners yet
              </h3>
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
                        <h3 className="font-semibold text-gray-900">
                          {partner.name}
                        </h3>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {partnershipTypes.find(
                            (t) => t.value === partner.partnership_type
                          )?.label || partner.partnership_type}
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
                        onClick={() => {
                          setSelectedType("partner")
                          setSelectedId(partner.id)
                          typeof document !== "undefined" && document.getElementById("delete").showModal()
                        }}
                        className="p-1 text-gray-500 hover:text-red-600 rounded"
                        title="Delete partner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {partner.descritpion && (
                    <p className="text-gray-600 text-sm mb-3">
                      {partner.descritpion}
                    </p>
                  )}

                  {partner.details && (
                    <p className="text-gray-500 text-xs mb-3">
                      <strong>Partnership:</strong> {partner.details}
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
        <div className="fixed inset-0 !mt-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {modalType === "sponsor" ? (
                    <Crown className="w-5 h-5 text-yellow-600" />
                  ) : (
                    <Building2 className="w-5 h-5 text-blue-600" />
                  )}
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
                    label={`${
                      modalType === "sponsor" ? "Sponsor" : "Partner"
                    } Name *`}
                    placeholder="Enter name"
                    value={
                      modalType === "sponsor"
                        ? sponsorFormData.name
                        : partnerFormData.name
                    }
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    isRequired={true}
                  />

                  <InputWithFullBoarder
                    label="Website URL"
                    placeholder="https://example.com"
                    value={
                      modalType === "sponsor"
                        ? sponsorFormData.website
                        : partnerFormData.website
                    }
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                  />
                </div>

                <InputWithFullBoarder
                  label="Description"
                  placeholder="Brief description of the partnership/sponsorship"
                  isTextArea={true}
                  rows={3}
                  value={
                    modalType === "sponsor"
                      ? sponsorFormData.description
                      : partnerFormData.descritpion
                  }
                  onChange={(e) =>
                    handleInputChange(
                      modalType === "sponsor" ? "description" : "descritpion",
                      e.target.value
                    )
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {modalType === "sponsor" ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sponsorship Tier
                      </label>
                      <select
                        value={sponsorFormData.sponsorship_tier}
                        onChange={(e) =>
                          handleInputChange("sponsorship_tier", e.target.value)
                        }
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
                        value={partnerFormData.partnership_type}
                        onChange={(e) =>
                          handleInputChange("partnership_type", e.target.value)
                        }
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo
                    </label>

                    {/* Upload Mode Toggle */}
                    <div className="flex gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setLogoUploadMode("url")}
                        className={`px-3 py-1 text-xs rounded ${
                          logoUploadMode === "url"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        <Link className="w-3 h-3 inline mr-1" />
                        URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setLogoUploadMode("upload")}
                        className={`px-3 py-1 text-xs rounded ${
                          logoUploadMode === "upload"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        <Upload className="w-3 h-3 inline mr-1" />
                        Upload
                      </button>
                    </div>

                    {logoUploadMode === "url" ? (
                      <InputWithFullBoarder
                        placeholder="https://example.com/logo.png"
                        value={
                          modalType === "sponsor"
                            ? sponsorFormData.logo
                            : partnerFormData.logo
                        }
                        onChange={(e) =>
                          handleInputChange("logo", e.target.value)
                        }
                      />
                    ) : (
                      <div>
                        <ImageUploader
                          onImageChange={handleLogoFileSelect}
                          currentImage={
                            modalType === "sponsor"
                              ? sponsorFormData.logo
                              : partnerFormData.logo
                          }
                          height="h-32"
                          label="Drop logo here or click to browse"
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Contact Person"
                    placeholder="John Smith"
                    value={
                      modalType === "sponsor"
                        ? sponsorFormData.contact_person
                        : partnerFormData.contact_person
                    }
                    onChange={(e) =>
                      handleInputChange("contact_person", e.target.value)
                    }
                  />

                  <InputWithFullBoarder
                    label="Contact Email"
                    type="email"
                    placeholder="contact@example.com"
                    value={
                      modalType === "sponsor"
                        ? sponsorFormData.contact_email
                        : partnerFormData.contact_email
                    }
                    onChange={(e) =>
                      handleInputChange("contact_email", e.target.value)
                    }
                  />
                </div>

                <InputWithFullBoarder
                  label={
                    modalType === "sponsor"
                      ? "Contribution/Benefits"
                      : "Partnership Details"
                  }
                  placeholder={
                    modalType === "sponsor"
                      ? "What are they providing or receiving?"
                      : "What does this partnership involve?"
                  }
                  isTextArea={true}
                  rows={2}
                  value={
                    modalType === "sponsor"
                      ? sponsorFormData.contribution_benefits
                      : partnerFormData.details
                  }
                  onChange={(e) =>
                    handleInputChange(
                      modalType === "sponsor"
                        ? "contribution_benefits"
                        : "details",
                      e.target.value
                    )
                  }
                />

                <div className="flex gap-3 pt-4">
                  <CustomButton
                    buttonText={editingItem ? "Update" : "Add"}
                    prefixIcon={<Save className="w-4 h-4" />}
                    buttonColor={
                      modalType === "sponsor" ? "bg-yellow-600" : "bg-blue-600"
                    }
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
       <DeleteConfirmationModal id={"delete"} successFul={false} title={`Delete ${selectedType === "sponsor" ? "Sponsor" : "Partner" }`} isLoading={deletingSponsors || deletingPartners} buttonColor={"bg-red-500"} buttonText={"Delete"} body={`Are you sure you want to delete this ${selectedType === "sponsor" ? "Sponsor" : "Partner" }?`} 
                    onClick={async () => { 
                      try {
                        if (selectedType === "sponsor") {
                          await deleteSponsors(event.id, [selectedId]);
                        } else {
                          await deletePartners(event.id, [selectedId]);
                        }
                      } catch (error) {
                        console.error("Error deleting:", error);
                        alert("Error deleting. Please try again.");
                      } 
                    } 
                    }
                    />
    </div>
  );
};

export default SponsorsPartnersTab;
