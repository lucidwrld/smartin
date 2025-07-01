"use client";

import React, { useState } from "react";
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

const VendorCard = ({ vendor, onEdit, onDelete, onUpdateStatus, isLoading }) => {
  const {
    id,
    name,
    company,
    service_type,
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

  const getStatusColor = (status) => {
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

  const getPaymentStatusColor = (status) => {
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

  const renderStars = (rating) => {
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

  const formatCurrency = (amount) => {
    if (!amount) return "";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-gray-900 truncate">{name}</h4>
              <span className={`px-2 py-1 text-xs rounded ${getStatusColor(status)}`}>
                {status}
              </span>
              {payment_status && (
                <span className={`px-2 py-1 text-xs rounded ${getPaymentStatusColor(payment_status)}`}>
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
                {service_type}
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

            {services_provided && services_provided.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {services_provided.map((service, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                  >
                    {service}
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
              onChange={(e) => onUpdateStatus(id, e.target.value)}
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
            onClick={() => onDelete(id)}
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

const VendorModal = ({ isOpen, onClose, vendor, onSave, isLoading }) => {
  const [formData, setFormData] = useState({
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
    services_provided: [],
    contract_date: "",
  });

  React.useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || "",
        company: vendor.company || "",
        service_type: vendor.service_type || "",
        contact_person: vendor.contact_person || "",
        email: vendor.email || "",
        phone: vendor.phone || "",
        address: vendor.address || "",
        website: vendor.website || "",
        rating: vendor.rating || 0,
        status: vendor.status || "pending",
        contract_amount: vendor.contract_amount || "",
        payment_status: vendor.payment_status || "pending",
        notes: vendor.notes || "",
        services_provided: vendor.services_provided || [],
        contract_date: vendor.contract_date || "",
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
        services_provided: [],
        contract_date: "",
      });
    }
  }, [vendor, isOpen]);

  const handleServicesChange = (e) => {
    const servicesString = e.target.value;
    const servicesArray = servicesString
      .split(",")
      .map((service) => service.trim())
      .filter((service) => service.length > 0);
    setFormData({ ...formData, services_provided: servicesArray });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.company.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    const vendorData = {
      ...formData,
      id: vendor?.id || `vendor_${Date.now()}`,
      contract_amount: formData.contract_amount ? parseFloat(formData.contract_amount) : null,
      rating: parseInt(formData.rating),
      createdAt: vendor?.createdAt || new Date().toISOString(),
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
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
                label="Vendor/Contact Name *"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter vendor name"
              />
              <InputWithFullBoarder
                label="Company *"
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
                  Service Type *
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
                    setFormData({ ...formData, rating: parseInt(e.target.value) })
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
                value={formData.contract_date}
                onChange={(e) =>
                  setFormData({ ...formData, contract_date: e.target.value })
                }
                type="date"
              />
            </div>

            <InputWithFullBoarder
              label="Services Provided (comma-separated)"
              value={formData.services_provided.join(", ")}
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

const VendorsManagementTab = ({ event }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterService, setFilterService] = useState("all");

  // Initialize with mock data if event has vendors
  React.useEffect(() => {
    if (event?.vendors) {
      setVendors(event.vendors);
    } else {
      // Mock data for demonstration
      setVendors([
        {
          id: "vendor_1",
          name: "Sarah Johnson",
          company: "Elite Catering Solutions",
          service_type: "Catering",
          contact_person: "Sarah Johnson",
          email: "sarah@elitecatering.com",
          phone: "+1 (555) 123-4567",
          address: "123 Main St, New York, NY 10001",
          website: "https://elitecatering.com",
          rating: 5,
          status: "confirmed",
          contract_amount: 8500,
          payment_status: "paid",
          notes: "Excellent service, highly recommended. Specializes in corporate events.",
          services_provided: ["Buffet Service", "Beverages", "Waitstaff"],
          contract_date: "2024-01-15",
          createdAt: "2024-01-10T10:00:00Z",
        },
        {
          id: "vendor_2",
          name: "Mike Chen",
          company: "PhotoPro Studios",
          service_type: "Photography",
          contact_person: "Mike Chen",
          email: "mike@photopro.com",
          phone: "+1 (555) 987-6543",
          address: "456 Photography Ave, Los Angeles, CA 90210",
          website: "https://photoprostudios.com",
          rating: 4,
          status: "contracted",
          contract_amount: 3200,
          payment_status: "partial",
          notes: "Creative photographer with great portfolio. Payment scheduled in installments.",
          services_provided: ["Event Photography", "Photo Editing", "Digital Gallery"],
          contract_date: "2024-01-20",
          createdAt: "2024-01-12T14:30:00Z",
        },
        {
          id: "vendor_3",
          name: "Lisa Rodriguez",
          company: "Sound & Vision AV",
          service_type: "Audio/Visual",
          contact_person: "Lisa Rodriguez",
          email: "lisa@soundvision.com",
          phone: "+1 (555) 456-7890",
          website: "https://soundvision.com",
          rating: 4,
          status: "pending",
          contract_amount: 2800,
          payment_status: "pending",
          notes: "Waiting for final confirmation on equipment requirements.",
          services_provided: ["Audio Equipment", "Projection", "Lighting", "Technical Support"],
          contract_date: "",
          createdAt: "2024-01-18T09:15:00Z",
        },
        {
          id: "vendor_4",
          name: "David Park",
          company: "Elegant Decorations",
          service_type: "Decoration",
          contact_person: "David Park",
          email: "david@elegantdecorations.com",
          phone: "+1 (555) 321-0987",
          address: "789 Design Blvd, Miami, FL 33101",
          website: "https://elegantdecorations.com",
          rating: 3,
          status: "cancelled",
          contract_amount: 4500,
          payment_status: "pending",
          notes: "Cancelled due to scheduling conflicts. Looking for replacement.",
          services_provided: ["Floral Arrangements", "Table Settings", "Backdrop Design"],
          contract_date: "",
          createdAt: "2024-01-08T16:45:00Z",
        },
      ]);
    }
  }, [event]);

  const handleAddVendor = () => {
    setEditingVendor(null);
    setIsModalOpen(true);
  };

  const handleEditVendor = (vendor) => {
    setEditingVendor(vendor);
    setIsModalOpen(true);
  };

  const handleSaveVendor = (vendorData) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (editingVendor) {
        // Update existing vendor
        setVendors(vendors.map(v => 
          v.id === editingVendor.id ? vendorData : v
        ));
      } else {
        // Add new vendor
        setVendors([...vendors, vendorData]);
      }
      
      setIsModalOpen(false);
      setEditingVendor(null);
      setIsLoading(false);
    }, 1000);
  };

  const handleUpdateStatus = (vendorId, newStatus) => {
    setVendors(vendors.map(v => 
      v.id === vendorId ? { ...v, status: newStatus } : v
    ));
  };

  const handleDeleteVendor = (vendorId) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      setVendors(vendors.filter(v => v.id !== vendorId));
    }
  };

  const filteredVendors = vendors.filter(vendor => {
    const statusMatch = filterStatus === "all" || vendor.status === filterStatus;
    const serviceMatch = filterService === "all" || vendor.service_type === filterService;
    return statusMatch && serviceMatch;
  });

  const statusOptions = ["all", "pending", "confirmed", "contracted", "cancelled"];
  const serviceTypes = ["all", ...new Set(vendors.map(v => v.service_type).filter(Boolean))];

  const totalVendors = vendors.length;
  const confirmedVendors = vendors.filter(v => v.status === "confirmed" || v.status === "contracted").length;
  const totalBudget = vendors.reduce((sum, v) => sum + (v.contract_amount || 0), 0);
  const paidAmount = vendors
    .filter(v => v.payment_status === "paid")
    .reduce((sum, v) => sum + (v.contract_amount || 0), 0);

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
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status === "all" ? "All Status" : status.charAt(0).toUpperCase() + status.slice(1)}
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
              onChange={(e) => setFilterService(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              {serviceTypes.map(service => (
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
            {vendors.length === 0 ? "No vendors yet" : "No vendors match your filters"}
          </h3>
          <p className="text-gray-500 mb-4">
            {vendors.length === 0 
              ? "Start by adding vendors for your event."
              : "Try adjusting your filters to see more vendors."
            }
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
              key={vendor.id}
              vendor={vendor}
              onEdit={handleEditVendor}
              onDelete={handleDeleteVendor}
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
    </div>
  );
};

export default VendorsManagementTab;