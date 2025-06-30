import React, { useState } from "react";
import {
  Plus,
  Trash2,
  User,
  Award,
  Handshake,
  Edit2,
  ExternalLink,
} from "lucide-react";
import InputWithFullBoarder from "../InputWithFullBoarder";
import CustomButton from "../Button";

export const StakeholdersStep = ({ formData, onFormDataChange }) => {
  const [activeTab, setActiveTab] = useState("hosts");
  const [showAddHost, setShowAddHost] = useState(false);
  const [showAddSponsor, setShowAddSponsor] = useState(false);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [editingHost, setEditingHost] = useState(null);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [editingPartner, setEditingPartner] = useState(null);

  const [newHost, setNewHost] = useState({
    name: "",
    title: "",
    bio: "",
    image: "",
    social_links: {
      linkedin: "",
      twitter: "",
      website: "",
    },
  });

  const [newSponsor, setNewSponsor] = useState({
    name: "",
    logo: "",
    website: "",
    tier: "bronze",
    description: "",
  });

  const [newPartner, setNewPartner] = useState({
    name: "",
    logo: "",
    website: "",
    type: "media_partner",
  });

  const hosts = formData.hosts || [];
  const sponsors = formData.sponsors || [];
  const partners = formData.partners || [];

  const sponsorTiers = [
    { value: "platinum", label: "Platinum", color: "bg-gray-300" },
    { value: "gold", label: "Gold", color: "bg-yellow-200" },
    { value: "silver", label: "Silver", color: "bg-gray-200" },
    { value: "bronze", label: "Bronze", color: "bg-orange-200" },
  ];

  const partnerTypes = [
    { value: "media_partner", label: "Media Partner" },
    { value: "technology_partner", label: "Technology Partner" },
    { value: "community_partner", label: "Community Partner" },
    { value: "strategic_partner", label: "Strategic Partner" },
    { value: "other", label: "Other" },
  ];

  // Host Management
  const handleAddHost = () => {
    if (!newHost.name.trim()) {
      alert("Please enter host name");
      return;
    }

    const hostToAdd = {
      id: `host_${Date.now()}`,
      ...newHost,
    };

    const updatedHosts = [...hosts, hostToAdd];
    onFormDataChange("hosts", updatedHosts);

    setNewHost({
      name: "",
      title: "",
      bio: "",
      image: "",
      social_links: { linkedin: "", twitter: "", website: "" },
    });
    setShowAddHost(false);
  };

  const handleRemoveHost = (hostId) => {
    const updatedHosts = hosts.filter((host) => host.id !== hostId);
    onFormDataChange("hosts", updatedHosts);
  };

  const handleHostChange = (hostId, field, value) => {
    const updatedHosts = hosts.map((host) =>
      host.id === hostId ? { ...host, [field]: value } : host
    );
    onFormDataChange("hosts", updatedHosts);
  };

  const handleHostSocialChange = (hostId, platform, value) => {
    const updatedHosts = hosts.map((host) =>
      host.id === hostId
        ? {
            ...host,
            social_links: { ...host.social_links, [platform]: value },
          }
        : host
    );
    onFormDataChange("hosts", updatedHosts);
  };

  // Sponsor Management
  const handleAddSponsor = () => {
    if (!newSponsor.name.trim()) {
      alert("Please enter sponsor name");
      return;
    }

    const sponsorToAdd = {
      id: `sponsor_${Date.now()}`,
      ...newSponsor,
    };

    const updatedSponsors = [...sponsors, sponsorToAdd];
    onFormDataChange("sponsors", updatedSponsors);

    setNewSponsor({
      name: "",
      logo: "",
      website: "",
      tier: "bronze",
      description: "",
    });
    setShowAddSponsor(false);
  };

  const handleRemoveSponsor = (sponsorId) => {
    const updatedSponsors = sponsors.filter(
      (sponsor) => sponsor.id !== sponsorId
    );
    onFormDataChange("sponsors", updatedSponsors);
  };

  const handleSponsorChange = (sponsorId, field, value) => {
    const updatedSponsors = sponsors.map((sponsor) =>
      sponsor.id === sponsorId ? { ...sponsor, [field]: value } : sponsor
    );
    onFormDataChange("sponsors", updatedSponsors);
  };

  // Partner Management
  const handleAddPartner = () => {
    if (!newPartner.name.trim()) {
      alert("Please enter partner name");
      return;
    }

    const partnerToAdd = {
      id: `partner_${Date.now()}`,
      ...newPartner,
    };

    const updatedPartners = [...partners, partnerToAdd];
    onFormDataChange("partners", updatedPartners);

    setNewPartner({
      name: "",
      logo: "",
      website: "",
      type: "media_partner",
    });
    setShowAddPartner(false);
  };

  const handleRemovePartner = (partnerId) => {
    const updatedPartners = partners.filter(
      (partner) => partner.id !== partnerId
    );
    onFormDataChange("partners", updatedPartners);
  };

  const handlePartnerChange = (partnerId, field, value) => {
    const updatedPartners = partners.map((partner) =>
      partner.id === partnerId ? { ...partner, [field]: value } : partner
    );
    onFormDataChange("partners", updatedPartners);
  };

  const getTierColor = (tier) => {
    const tierData = sponsorTiers.find((t) => t.value === tier);
    return tierData ? tierData.color : "bg-gray-200";
  };

  const getPartnerTypeLabel = (type) => {
    const partnerType = partnerTypes.find((t) => t.value === type);
    return partnerType ? partnerType.label : type;
  };

  return (
    <div className="flex flex-col w-full text-brandBlack">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Event Stakeholders</h2>
        <p className="text-gray-600">
          Manage hosts, sponsors, and partners for your event. This information
          will be displayed on your public event page to give proper recognition
          and credit.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b">
          {[
            { id: "hosts", label: "Hosts", icon: User },
            { id: "sponsors", label: "Sponsors", icon: Award },
            { id: "partners", label: "Partners", icon: Handshake },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 font-medium text-sm focus:outline-none flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-b-2 border-purple-600 text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hosts Tab */}
      {activeTab === "hosts" && (
        <div className="space-y-6">
          {/* Existing Hosts */}
          <div className="space-y-4">
            {hosts.map((host) => (
              <div key={host.id} className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      {host.image ? (
                        <img
                          src={host.image}
                          alt={host.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{host.name}</h3>
                      {host.title && (
                        <p className="text-sm text-gray-600">{host.title}</p>
                      )}
                      {host.bio && (
                        <p className="text-sm text-gray-600 mt-2 max-w-md">
                          {host.bio}
                        </p>
                      )}
                      {/* Social Links */}
                      <div className="flex items-center gap-2 mt-2">
                        {host.social_links?.linkedin && (
                          <a
                            href={host.social_links.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            LinkedIn
                          </a>
                        )}
                        {host.social_links?.twitter && (
                          <a
                            href={host.social_links.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-600"
                          >
                            Twitter
                          </a>
                        )}
                        {host.social_links?.website && (
                          <a
                            href={host.social_links.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-800"
                          >
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setEditingHost(editingHost === host.id ? null : host.id)
                      }
                      className="text-blue-500 hover:text-blue-700 p-1"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveHost(host.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Edit Host Form */}
                {editingHost === host.id && (
                  <div className="border-t pt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputWithFullBoarder
                        label="Host Name"
                        value={host.name}
                        onChange={(e) =>
                          handleHostChange(host.id, "name", e.target.value)
                        }
                      />
                      <InputWithFullBoarder
                        label="Title/Position"
                        value={host.title}
                        onChange={(e) =>
                          handleHostChange(host.id, "title", e.target.value)
                        }
                      />
                    </div>
                    <InputWithFullBoarder
                      label="Bio"
                      isTextArea={true}
                      rows={3}
                      value={host.bio}
                      onChange={(e) =>
                        handleHostChange(host.id, "bio", e.target.value)
                      }
                    />
                    <InputWithFullBoarder
                      label="Image URL"
                      value={host.image}
                      onChange={(e) =>
                        handleHostChange(host.id, "image", e.target.value)
                      }
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InputWithFullBoarder
                        label="LinkedIn URL"
                        value={host.social_links?.linkedin || ""}
                        onChange={(e) =>
                          handleHostSocialChange(
                            host.id,
                            "linkedin",
                            e.target.value
                          )
                        }
                      />
                      <InputWithFullBoarder
                        label="Twitter URL"
                        value={host.social_links?.twitter || ""}
                        onChange={(e) =>
                          handleHostSocialChange(
                            host.id,
                            "twitter",
                            e.target.value
                          )
                        }
                      />
                      <InputWithFullBoarder
                        label="Website URL"
                        value={host.social_links?.website || ""}
                        onChange={(e) =>
                          handleHostSocialChange(
                            host.id,
                            "website",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Host Button */}
          {!showAddHost && (
            <button
              onClick={() => setShowAddHost(true)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Host
            </button>
          )}

          {/* Add Host Form */}
          {showAddHost && (
            <div className="border-2 border-purple-200 rounded-lg p-6 bg-purple-50">
              <h3 className="font-medium text-lg mb-4">Add New Host</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Host Name *"
                    value={newHost.name}
                    onChange={(e) =>
                      setNewHost({ ...newHost, name: e.target.value })
                    }
                  />
                  <InputWithFullBoarder
                    label="Title/Position"
                    value={newHost.title}
                    onChange={(e) =>
                      setNewHost({ ...newHost, title: e.target.value })
                    }
                  />
                </div>
                <InputWithFullBoarder
                  label="Bio"
                  isTextArea={true}
                  rows={3}
                  value={newHost.bio}
                  onChange={(e) =>
                    setNewHost({ ...newHost, bio: e.target.value })
                  }
                />
                <InputWithFullBoarder
                  label="Image URL"
                  value={newHost.image}
                  onChange={(e) =>
                    setNewHost({ ...newHost, image: e.target.value })
                  }
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputWithFullBoarder
                    label="LinkedIn URL"
                    value={newHost.social_links.linkedin}
                    onChange={(e) =>
                      setNewHost({
                        ...newHost,
                        social_links: {
                          ...newHost.social_links,
                          linkedin: e.target.value,
                        },
                      })
                    }
                  />
                  <InputWithFullBoarder
                    label="Twitter URL"
                    value={newHost.social_links.twitter}
                    onChange={(e) =>
                      setNewHost({
                        ...newHost,
                        social_links: {
                          ...newHost.social_links,
                          twitter: e.target.value,
                        },
                      })
                    }
                  />
                  <InputWithFullBoarder
                    label="Website URL"
                    value={newHost.social_links.website}
                    onChange={(e) =>
                      setNewHost({
                        ...newHost,
                        social_links: {
                          ...newHost.social_links,
                          website: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex gap-3">
                  <CustomButton
                    buttonText="Add Host"
                    onClick={handleAddHost}
                    buttonColor="bg-purple-600"
                    radius="rounded-md"
                  />
                  <CustomButton
                    buttonText="Cancel"
                    onClick={() => setShowAddHost(false)}
                    buttonColor="bg-gray-300"
                    textColor="text-gray-700"
                    radius="rounded-md"
                  />
                </div>
              </div>
            </div>
          )}

          {hosts.length === 0 && !showAddHost && (
            <div className="text-center py-8 text-gray-500">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hosts added yet. Click "Add Host" to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Sponsors Tab */}
      {activeTab === "sponsors" && (
        <div className="space-y-6">
          {/* Existing Sponsors */}
          <div className="space-y-4">
            {sponsors.map((sponsor) => (
              <div key={sponsor.id} className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {sponsor.logo ? (
                        <img
                          src={sponsor.logo}
                          alt={sponsor.name}
                          className="w-full h-full rounded-lg object-cover"
                        />
                      ) : (
                        <Award className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-lg">{sponsor.name}</h3>
                        <span
                          className={`px-2 py-1 text-xs rounded ${getTierColor(
                            sponsor.tier
                          )} text-gray-800`}
                        >
                          {sponsor.tier.charAt(0).toUpperCase() +
                            sponsor.tier.slice(1)}
                        </span>
                      </div>
                      {sponsor.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {sponsor.description}
                        </p>
                      )}
                      {sponsor.website && (
                        <a
                          href={sponsor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-800 text-sm flex items-center gap-1"
                        >
                          Visit Website <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setEditingSponsor(
                          editingSponsor === sponsor.id ? null : sponsor.id
                        )
                      }
                      className="text-blue-500 hover:text-blue-700 p-1"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveSponsor(sponsor.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Edit Sponsor Form */}
                {editingSponsor === sponsor.id && (
                  <div className="border-t pt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputWithFullBoarder
                        label="Sponsor Name"
                        value={sponsor.name}
                        onChange={(e) =>
                          handleSponsorChange(
                            sponsor.id,
                            "name",
                            e.target.value
                          )
                        }
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sponsor Tier
                        </label>
                        <select
                          value={sponsor.tier}
                          onChange={(e) =>
                            handleSponsorChange(
                              sponsor.id,
                              "tier",
                              e.target.value
                            )
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
                    </div>
                    <InputWithFullBoarder
                      label="Logo URL"
                      value={sponsor.logo}
                      onChange={(e) =>
                        handleSponsorChange(sponsor.id, "logo", e.target.value)
                      }
                    />
                    <InputWithFullBoarder
                      label="Website URL"
                      value={sponsor.website}
                      onChange={(e) =>
                        handleSponsorChange(
                          sponsor.id,
                          "website",
                          e.target.value
                        )
                      }
                    />
                    <InputWithFullBoarder
                      label="Description"
                      isTextArea={true}
                      rows={2}
                      value={sponsor.description}
                      onChange={(e) =>
                        handleSponsorChange(
                          sponsor.id,
                          "description",
                          e.target.value
                        )
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Sponsor Button */}
          {!showAddSponsor && (
            <button
              onClick={() => setShowAddSponsor(true)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Sponsor
            </button>
          )}

          {/* Add Sponsor Form */}
          {showAddSponsor && (
            <div className="border-2 border-purple-200 rounded-lg p-6 bg-purple-50">
              <h3 className="font-medium text-lg mb-4">Add New Sponsor</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Sponsor Name *"
                    value={newSponsor.name}
                    onChange={(e) =>
                      setNewSponsor({ ...newSponsor, name: e.target.value })
                    }
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sponsor Tier
                    </label>
                    <select
                      value={newSponsor.tier}
                      onChange={(e) =>
                        setNewSponsor({ ...newSponsor, tier: e.target.value })
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
                </div>
                <InputWithFullBoarder
                  label="Logo URL"
                  value={newSponsor.logo}
                  onChange={(e) =>
                    setNewSponsor({ ...newSponsor, logo: e.target.value })
                  }
                />
                <InputWithFullBoarder
                  label="Website URL"
                  value={newSponsor.website}
                  onChange={(e) =>
                    setNewSponsor({ ...newSponsor, website: e.target.value })
                  }
                />
                <InputWithFullBoarder
                  label="Description"
                  isTextArea={true}
                  rows={3}
                  value={newSponsor.description}
                  onChange={(e) =>
                    setNewSponsor({
                      ...newSponsor,
                      description: e.target.value,
                    })
                  }
                />
                <div className="flex gap-3">
                  <CustomButton
                    buttonText="Add Sponsor"
                    onClick={handleAddSponsor}
                    buttonColor="bg-purple-600"
                    radius="rounded-md"
                  />
                  <CustomButton
                    buttonText="Cancel"
                    onClick={() => setShowAddSponsor(false)}
                    buttonColor="bg-gray-300"
                    textColor="text-gray-700"
                    radius="rounded-md"
                  />
                </div>
              </div>
            </div>
          )}

          {sponsors.length === 0 && !showAddSponsor && (
            <div className="text-center py-8 text-gray-500">
              <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No sponsors added yet. Click "Add Sponsor" to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Partners Tab */}
      {activeTab === "partners" && (
        <div className="space-y-6">
          {/* Existing Partners */}
          <div className="space-y-4">
            {partners.map((partner) => (
              <div key={partner.id} className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {partner.logo ? (
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="w-full h-full rounded-lg object-cover"
                        />
                      ) : (
                        <Handshake className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-lg">{partner.name}</h3>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {getPartnerTypeLabel(partner.type)}
                        </span>
                      </div>
                      {partner.website && (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-800 text-sm flex items-center gap-1"
                        >
                          Visit Website <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setEditingPartner(
                          editingPartner === partner.id ? null : partner.id
                        )
                      }
                      className="text-blue-500 hover:text-blue-700 p-1"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleRemovePartner(partner.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Edit Partner Form */}
                {editingPartner === partner.id && (
                  <div className="border-t pt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputWithFullBoarder
                        label="Partner Name"
                        value={partner.name}
                        onChange={(e) =>
                          handlePartnerChange(
                            partner.id,
                            "name",
                            e.target.value
                          )
                        }
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Partner Type
                        </label>
                        <select
                          value={partner.type}
                          onChange={(e) =>
                            handlePartnerChange(
                              partner.id,
                              "type",
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        >
                          {partnerTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <InputWithFullBoarder
                      label="Logo URL"
                      value={partner.logo}
                      onChange={(e) =>
                        handlePartnerChange(partner.id, "logo", e.target.value)
                      }
                    />
                    <InputWithFullBoarder
                      label="Website URL"
                      value={partner.website}
                      onChange={(e) =>
                        handlePartnerChange(
                          partner.id,
                          "website",
                          e.target.value
                        )
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Partner Button */}
          {!showAddPartner && (
            <button
              onClick={() => setShowAddPartner(true)}
              className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Partner
            </button>
          )}

          {/* Add Partner Form */}
          {showAddPartner && (
            <div className="border-2 border-purple-200 rounded-lg p-6 bg-purple-50">
              <h3 className="font-medium text-lg mb-4">Add New Partner</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Partner Name *"
                    value={newPartner.name}
                    onChange={(e) =>
                      setNewPartner({ ...newPartner, name: e.target.value })
                    }
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Partner Type
                    </label>
                    <select
                      value={newPartner.type}
                      onChange={(e) =>
                        setNewPartner({ ...newPartner, type: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    >
                      {partnerTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <InputWithFullBoarder
                  label="Logo URL"
                  value={newPartner.logo}
                  onChange={(e) =>
                    setNewPartner({ ...newPartner, logo: e.target.value })
                  }
                />
                <InputWithFullBoarder
                  label="Website URL"
                  value={newPartner.website}
                  onChange={(e) =>
                    setNewPartner({ ...newPartner, website: e.target.value })
                  }
                />
                <div className="flex gap-3">
                  <CustomButton
                    buttonText="Add Partner"
                    onClick={handleAddPartner}
                    buttonColor="bg-purple-600"
                    radius="rounded-md"
                  />
                  <CustomButton
                    buttonText="Cancel"
                    onClick={() => setShowAddPartner(false)}
                    buttonColor="bg-gray-300"
                    textColor="text-gray-700"
                    radius="rounded-md"
                  />
                </div>
              </div>
            </div>
          )}

          {partners.length === 0 && !showAddPartner && (
            <div className="text-center py-8 text-gray-500">
              <Handshake className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No partners added yet. Click "Add Partner" to get started.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
