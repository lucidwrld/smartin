"use client";

import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Building2,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  FileText,
  User,
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import StatusButton from "@/components/StatusButton";
import {
  AddVendorsManager,
  UpdateVendorsManager,
  DeleteVendorsManager,
} from "@/app/events/controllers/eventManagementController";
import { Event, Vendor } from "@/app/events/types";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";

interface VendorCardProps {
  vendor: Vendor;
  onEdit: (vendor: Vendor) => void;
  onDelete: (vendorId: string) => void;
  onUpdateStatus: (vendorId: string, status: string) => void;
  isLoading: boolean;
}

const VendorCard: React.FC<VendorCardProps> = ({
  vendor,
  onEdit,
  onDelete,
  onUpdateStatus,
  isLoading,
}) => {
  const {
    id,
    _id,
    name,
    company,
    job_description,
    contact_person,
    email,
    phone,
    address,
    website,
    rating,
    status,
    contract_amount,
    payment_status,
    notes,
    services_provided,
    contract_date,
    createdAt,
  } = vendor;

  const vendorId = id || _id || "";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "contracted":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "partial":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        className={`${
          index < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string | undefined) => {
    try {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "N/A";
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-[30px] text-gray-900 truncate">{name}</h4>
              <span
                className={`px-2 py-1 text-xs rounded ${getStatusColor(
                  status
                )}`}
              >
                {status}
              </span>
              {payment_status && (
                <span
                  className={`px-2 py-1 text-xs rounded ${getPaymentStatusColor(
                    payment_status
                  )}`}
                >
                  {payment_status}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {company}
              </span>
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {job_description}
              </span>
              {rating && (
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">{renderStars(rating)}</div>
                  <span className="text-xs">({rating}/5)</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              {contact_person && (
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {contact_person}
                </span>
              )}
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
              {contract_amount && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {formatCurrency(contract_amount)}
                </span>
              )}
            </div>

            {services_provided && services_provided.trim() && (
              <div className="mt-2 flex flex-wrap gap-1">
                {services_provided.split(",").map((service, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    {service.trim()}
                  </span>
                ))}
              </div>
            )}

            {notes && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{notes}</p>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
              {contract_date && (
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  Contract: {formatDate(contract_date)}
                </span>
              )}
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
              onChange={(e) => onUpdateStatus(vendorId, e.target.value)}
              className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="contracted">Contracted</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <button
            onClick={() => onEdit(vendor)}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
            title="Edit vendor"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete()}
            disabled={isLoading}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Delete vendor"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface VendorFormData {
  name: string;
  company: string;
  service_type: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  rating: number;
  status: string;
  contract_amount: string;
  payment_status: string;
  notes: string;
  services_provided: string;
  contract_date: string;
}

interface VendorModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor | null;
  onSave: (vendor: Vendor) => void;
  isLoading: boolean;
}

const VendorModal: React.FC<VendorModalProps> = ({
  isOpen,
  onClose,
  vendor,
  onSave,
  isLoading,
}) => {
  const [formData, setFormData] = useState<VendorFormData>({
    name: "",
    company: "",
    service_type: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    rating: 0,
    status: "pending",
    contract_amount: "",
    payment_status: "pending",
    notes: "",
    services_provided: "",
    contract_date: "",
  });

  useEffect(() => {
    if (vendor) {
      console.log(vendor)
      setFormData({
        name: vendor.name || "",
        company: vendor.company || "",
        service_type: vendor.job_description || "",
        contact_person: vendor.contact_person || "",
        email: vendor.email || "",
        phone: vendor.phone || "",
        address: vendor.address || "",
        website: vendor.website || "",
        rating: vendor.rating || 0,
        status: vendor.status || "pending",
        contract_amount: vendor.contract_amount?.toString() || "",
        payment_status: vendor.payment_status || "pending",
        notes: vendor.notes || "",
        services_provided: vendor.services_provided || "",
        contract_date: new Date(vendor.contract_date).toISOString().split('T')[0] || "",
      });
    } else {
      setFormData({
        name: "",
        company: "",
        service_type: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
        website: "",
        rating: 0,
        status: "pending",
        contract_amount: "",
        payment_status: "pending",
        notes: "",
        services_provided: "",
        contract_date: "",
      });
    }
  }, [vendor, isOpen]);

  const handleServicesChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Keep as comma-separated string
    setFormData({ ...formData, services_provided: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.company.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    const vendorData: Vendor = {
      ...vendor,
      name: formData.name,
      company: formData.company,
      job_description: formData.service_type,
      contact_person: formData.contact_person,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      website: formData.website,
      status: formData.status,
      payment_status: formData.payment_status,
      contract_amount: formData.contract_amount
        ? parseFloat(formData.contract_amount)
        : 0,
      contract_date: formData.contract_date,
      services_provided: formData.services_provided,
      notes: formData.notes,
      rating: formData.rating,
    };

    onSave(vendorData);
  };

  if (!isOpen) return null;

  const serviceTypes = [
    "Catering",
    "Photography",
    "Videography",
    "Audio/Visual",
    "Decoration",
    "Venue",
    "Transportation",
    "Security",
    "Entertainment",
    "Printing",
    "Flowers",
    "Music/DJ",
    "Other",
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "contracted", label: "Contracted" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const paymentStatusOptions = [
    { value: "pending", label: "Pending" },
    { value: "partial", label: "Partial" },
    { value: "paid", label: "Paid" },
    { value: "overdue", label: "Overdue" },
  ];

  return (
    <div className="fixed inset-0 top-0 bg-black bg-opacity-50 !mt-0 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {vendor ? "Edit Vendor" : "Add New Vendor"}
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
                label="Vendor/Contact Name"
                isRequired
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter vendor name"
              />
              <InputWithFullBoarder
                label="Company "
                isRequired
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                placeholder="Enter company name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Service Type  <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.service_type}
                  onChange={(e) =>
                    setFormData({ ...formData, service_type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  <option value="">Select service type</option>
                  {serviceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <InputWithFullBoarder
                label="Contact Person"
                value={formData.contact_person}
                onChange={(e) =>
                  setFormData({ ...formData, contact_person: e.target.value })
                }
                placeholder="Primary contact person"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithFullBoarder
                label="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="contact@company.com"
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

            <InputWithFullBoarder
              label="Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Full business address"
            />

            <InputWithFullBoarder
              label="Website"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              placeholder="https://company.com"
              type="url"
            />

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
                  Payment Status
                </label>
                <select
                  value={formData.payment_status}
                  onChange={(e) =>
                    setFormData({ ...formData, payment_status: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  {paymentStatusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating (1-5)
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rating: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value={0}>No rating</option>
                  <option value={1}>1 Star</option>
                  <option value={2}>2 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={5}>5 Stars</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputWithFullBoarder
                label="Contract Amount"
                value={formData.contract_amount}
                onChange={(e) =>
                  setFormData({ ...formData, contract_amount: e.target.value })
                }
                placeholder="0.00"
                type="number"
                step="0.01"
              />
              <InputWithFullBoarder
                label="Contract Date"
                isRequired
                value={formData.contract_date}
                onChange={(e) =>
                  setFormData({ ...formData, contract_date: e.target.value })
                }
                type="date"
              />
            </div>

            <InputWithFullBoarder
              label="Services Provided (comma-separated)"
              value={formData.services_provided}
              onChange={handleServicesChange}
              placeholder="service1, service2, service3"
            />

            <InputWithFullBoarder
              label="Notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Additional notes about this vendor"
              isTextArea={true}
              rows={3}
            />

            <div className="flex gap-3 pt-4">
              <CustomButton
                buttonText={vendor ? "Update Vendor" : "Add Vendor"}
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

interface VendorsManagementTabProps {
  event: Event;
  refetch: () => void;
  onFilterChange?: (filters: { status: string; service: string }) => void;
}

const VendorsManagementTab: React.FC<VendorsManagementTabProps> = ({
  event,
  onFilterChange,
  refetch,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterService, setFilterService] = useState("all");
  const [selectedId, setSelectedId] = useState(null)
  // Controllers
  const {
    addVendors,
    isLoading: adding,
    isSuccess: addSuccess,
  } = AddVendorsManager();
  const {
    updateVendors,
    isLoading: updating,
    isSuccess: updateSuccess,
  } = UpdateVendorsManager();
  const {
    deleteVendors,
    isLoading: deleting,
    isSuccess: deleteSuccess,
  } = DeleteVendorsManager();

  const isLoading = adding || updating || deleting;

  // Get vendors directly from props (already filtered by backend)
  const vendors =
    event?.vendors && Array.isArray(event.vendors) ? event.vendors : [];

  const handleAddVendor = () => {
    setEditingVendor(null);
    setIsModalOpen(true);
  };

  const handleEditVendor = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setIsModalOpen(true);
  };

  const handleSaveVendor = async (vendorData: Vendor) => {
    try {
      if (editingVendor) {
        // For update, only send the changed fields
        const changedFields: Partial<Vendor> = {};
        
        // Get all keys from vendorData and compare with editingVendor
        Object.keys(vendorData).forEach((key) => {
          const vendorKey = key as keyof Vendor;
          if (vendorData[vendorKey] !== editingVendor[vendorKey]) {
            (changedFields as any)[vendorKey] = vendorData[vendorKey];
          }
        });

        // Update existing vendor with only changed fields
        await updateVendors(
          event.id || event._id,
          editingVendor.id || editingVendor._id,
          changedFields as Vendor
        );
      } else {
        // Add new vendor - send all fields
        const vendorPayload: Vendor = {
          name: vendorData.name,
          company: vendorData.company,
          contact_person: vendorData.contact_person,
          email: vendorData.email,
          phone: vendorData.phone,
          address: vendorData.address,
          website: vendorData.website,
          job_description: vendorData.job_description,
          status: vendorData.status,
          payment_status: vendorData.payment_status,
          contract_amount: vendorData.contract_amount,
          contract_date: vendorData.contract_date,
          services_provided: vendorData.services_provided,
          notes: vendorData.notes,
          rating: vendorData.rating,
        };
        
        await addVendors(event.id || event._id, vendorPayload);
      }

      setIsModalOpen(false);
      setEditingVendor(null);
    } catch (error) {
      console.error("Error saving vendor:", error);
      alert("Error saving vendor. Please try again.");
    }
  };

  const handleUpdateStatus = async (vendorId: string, newStatus: string) => {
    try {
      // Only send the status field for update
      const statusUpdate = { status: newStatus } as Vendor;
      await updateVendors(event.id || event._id, vendorId, statusUpdate);
    } catch (error) {
      console.error("Error updating vendor status:", error);
      alert("Error updating vendor status. Please try again.");
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      try {
        await deleteVendors(event.id || event._id, [vendorId]);
      } catch (error) {
        console.error("Error deleting vendor:", error);
        alert("Error deleting vendor. Please try again.");
      }
    }
  };

  // All data should come from backend based on filters
  const filteredVendors = vendors; // Backend should return filtered data

  const statusOptions = [
    "all",
    "pending",
    "confirmed",
    "contracted",
    "cancelled",
  ];
  const serviceTypes = ["all"]; // TODO: Backend should provide available service types

  // Stats - backend doesn't provide these yet, so display 0
  // TODO: Backend should provide vendor statistics
  const totalVendors = vendors.length;
  const confirmedVendors = 0;
  const totalBudget = 0;
  const paidAmount = 0;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Vendors</p>
              <p className="text-2xl font-semibold text-gray-900">
                {totalVendors}
              </p>
            </div>
            <Building2 className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Confirmed</p>
              <p className="text-2xl font-semibold text-green-600">
                {confirmedVendors}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Budget</p>
              <p className="text-2xl font-semibold text-purple-600">
                ${totalBudget.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Paid Amount</p>
              <p className="text-2xl font-semibold text-green-600">
                ${paidAmount.toLocaleString()}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                onFilterChange?.({
                  status: e.target.value,
                  service: filterService,
                });
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "all"
                    ? "All Status"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Service
            </label>
            <select
              value={filterService}
              onChange={(e) => {
                setFilterService(e.target.value);
                onFilterChange?.({
                  status: filterStatus,
                  service: e.target.value,
                });
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              {serviceTypes.map((service) => (
                <option key={service} value={service}>
                  {service === "all" ? "All Services" : service}
                </option>
              ))}
            </select>
          </div>
        </div>

        <CustomButton
          buttonText="Add Vendor"
          onClick={handleAddVendor}
          prefixIcon={<Plus size={16} />}
          buttonColor="bg-purple-600"
          radius="rounded-full"
        />
      </div>

      {/* Vendors List */}
      {filteredVendors.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {vendors.length === 0
              ? "No vendors yet"
              : "No vendors match your filters"}
          </h3>
          <p className="text-gray-500 mb-4">
            {vendors.length === 0
              ? "Start by adding vendors for your event."
              : "Try adjusting your filters to see more vendors."}
          </p>
          {vendors.length === 0 && (
            <CustomButton
              buttonText="Add First Vendor"
              onClick={handleAddVendor}
              prefixIcon={<Plus size={16} />}
              buttonColor="bg-purple-600"
              radius="rounded-full"
            />
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredVendors.map((vendor) => (
            <VendorCard
              key={vendor.id || vendor._id}
              vendor={vendor}
              onEdit={handleEditVendor}
              onDelete={() => {setSelectedId(vendor.id || vendor._id); typeof document !== "undefined" && document.getElementById("delete").showModal()}}
              onUpdateStatus={handleUpdateStatus}
              isLoading={isLoading}
            />
          ))}
        </div>
      )}

      {/* Vendor Modal */}
      <VendorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingVendor(null);
        }}
        vendor={editingVendor}
        onSave={handleSaveVendor}
        isLoading={isLoading}
      />
      <DeleteConfirmationModal id={"delete"} successFul={false} title={"Delete Vendor"} isLoading={deleting} buttonColor={"bg-red-500"} buttonText={"Delete"} body={"Are you sure you want to delete this vendor?"} 
        onClick={async () => { 
         await deleteVendors(event.id || event._id, [selectedId])
        } 
        }
        />
    </div>
  );
};

export default VendorsManagementTab;
