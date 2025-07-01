"use client";

import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Crown,
  Star,
  Users,
  Calendar,
  DollarSign,
  Check,
  X,
  Save,
  Package,
  Zap,
  Clock,
  Gift,
  Percent,
  Copy,
  Eye,
  EyeOff,
  BarChart3
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";

const SubscriptionManagementTab = ({ userId }) => {
  const [packages, setPackages] = useState([
    {
      id: "package_1",
      name: "Basic Access",
      description: "Essential features for single event access",
      price: 29.99,
      currency: "USD",
      billing_cycle: "one_time",
      duration_months: null,
      is_active: true,
      is_featured: false,
      subscriber_count: 15,
      features: [
        "Event access",
        "Basic notifications",
        "Standard support",
        "Single event entry"
      ],
      limits: {
        events_per_month: 1,
        guests_per_event: 10,
        features_included: ["basic_rsvp", "basic_notifications"]
      },
      created_at: "2024-07-01T10:00:00"
    },
    {
      id: "package_2",
      name: "Premium Membership",
      description: "Enhanced features with priority access and benefits",
      price: 79.99,
      currency: "USD", 
      billing_cycle: "monthly",
      duration_months: 1,
      is_active: true,
      is_featured: true,
      subscriber_count: 42,
      features: [
        "Multiple event access",
        "Priority notifications",
        "Premium support",
        "Early access to events",
        "Exclusive content",
        "VIP seating",
        "Meet & greet opportunities"
      ],
      limits: {
        events_per_month: 5,
        guests_per_event: 25,
        features_included: ["priority_access", "vip_benefits", "exclusive_content"]
      },
      created_at: "2024-07-01T10:00:00"
    },
    {
      id: "package_3",
      name: "VIP Annual Pass",
      description: "Ultimate access with all premium features and maximum benefits",
      price: 499.99,
      currency: "USD",
      billing_cycle: "yearly",
      duration_months: 12,
      is_active: true,
      is_featured: false,
      subscriber_count: 8,
      features: [
        "Unlimited event access",
        "Instant notifications",
        "24/7 priority support",
        "First access to all events",
        "All exclusive content",
        "VIP treatment at all events",
        "Personal concierge service",
        "Exclusive networking events",
        "Discounts on merchandise"
      ],
      limits: {
        events_per_month: "unlimited",
        guests_per_event: "unlimited",
        features_included: ["all_features", "concierge_service", "exclusive_events"]
      },
      created_at: "2024-07-01T10:00:00"
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("packages");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    currency: "USD",
    billing_cycle: "monthly",
    duration_months: 1,
    is_active: true,
    is_featured: false,
    features: [""],
    limits: {
      events_per_month: "",
      guests_per_event: "",
      features_included: []
    }
  });

  const billingCycles = [
    { value: "one_time", label: "One-time Payment" },
    { value: "monthly", label: "Monthly" },
    { value: "quarterly", label: "Quarterly (3 months)" },
    { value: "yearly", label: "Yearly" }
  ];

  const currencies = [
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
    { value: "GBP", label: "GBP (£)" },
    { value: "NGN", label: "NGN (₦)" }
  ];

  const featureOptions = [
    "basic_rsvp",
    "priority_access", 
    "vip_benefits",
    "exclusive_content",
    "concierge_service",
    "exclusive_events",
    "all_features"
  ];

  const handleOpenModal = (packageData = null) => {
    setEditingPackage(packageData);
    
    if (packageData) {
      setFormData({
        name: packageData.name || "",
        description: packageData.description || "",
        price: packageData.price || "",
        currency: packageData.currency || "USD",
        billing_cycle: packageData.billing_cycle || "monthly",
        duration_months: packageData.duration_months || 1,
        is_active: packageData.is_active !== undefined ? packageData.is_active : true,
        is_featured: packageData.is_featured !== undefined ? packageData.is_featured : false,
        features: packageData.features || [""],
        limits: {
          events_per_month: packageData.limits?.events_per_month || "",
          guests_per_event: packageData.limits?.guests_per_event || "",
          features_included: packageData.limits?.features_included || []
        }
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        currency: "USD",
        billing_cycle: "monthly",
        duration_months: 1,
        is_active: true,
        is_featured: false,
        features: [""],
        limits: {
          events_per_month: "",
          guests_per_event: "",
          features_included: []
        }
      });
    }
    
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPackage(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      currency: "USD",
      billing_cycle: "monthly",
      duration_months: 1,
      is_active: true,
      is_featured: false,
      features: [""],
      limits: {
        events_per_month: "",
        guests_per_event: "",
        features_included: []
      }
    });
  };

  const handleInputChange = (field, value) => {
    if (field.startsWith("limits.")) {
      const limitField = field.split(".")[1];
      setFormData(prev => ({
        ...prev,
        limits: {
          ...prev.limits,
          [limitField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: updatedFeatures }));
  };

  const addFeature = () => {
    setFormData(prev => ({ 
      ...prev, 
      features: [...prev.features, ""] 
    }));
  };

  const removeFeature = (index) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, features: updatedFeatures }));
  };

  const handleFeatureIncludedToggle = (feature) => {
    const currentIncludes = formData.limits.features_included;
    const newIncludes = currentIncludes.includes(feature)
      ? currentIncludes.filter(f => f !== feature)
      : [...currentIncludes, feature];
    
    handleInputChange("limits.features_included", newIncludes);
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.price) {
      alert("Please enter package name and price");
      return;
    }

    setIsLoading(true);
    
    try {
      const newPackage = {
        id: editingPackage?.id || `package_${Date.now()}`,
        ...formData,
        price: parseFloat(formData.price),
        features: formData.features.filter(f => f.trim()),
        subscriber_count: editingPackage?.subscriber_count || 0,
        created_at: editingPackage?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (editingPackage) {
        setPackages(prev => 
          prev.map(pkg => pkg.id === editingPackage.id ? newPackage : pkg)
        );
      } else {
        setPackages(prev => [...prev, newPackage]);
      }

      // Here you would typically save to backend
      // await saveSubscriptionPackage(newPackage);

      handleCloseModal();
    } catch (error) {
      console.error("Error saving package:", error);
      alert("Error saving package. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (packageId) => {
    if (!confirm("Are you sure you want to delete this subscription package?")) {
      return;
    }

    try {
      setPackages(prev => prev.filter(pkg => pkg.id !== packageId));
      // await deleteSubscriptionPackage({ userId, packageId });
    } catch (error) {
      console.error("Error deleting package:", error);
      alert("Error deleting package. Please try again.");
    }
  };

  const togglePackageStatus = (packageId) => {
    setPackages(prev => 
      prev.map(pkg => 
        pkg.id === packageId 
          ? { ...pkg, is_active: !pkg.is_active }
          : pkg
      )
    );
  };

  const formatPrice = (price, currency, billingCycle) => {
    const symbol = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "₦";
    const cycleText = billingCycle === "one_time" ? "" : 
                     billingCycle === "monthly" ? "/month" :
                     billingCycle === "quarterly" ? "/quarter" :
                     billingCycle === "yearly" ? "/year" : "";
    return `${symbol}${price}${cycleText}`;
  };

  const getPackageIcon = (packageName) => {
    if (packageName.toLowerCase().includes("vip") || packageName.toLowerCase().includes("annual")) {
      return <Crown className="w-5 h-5" />;
    } else if (packageName.toLowerCase().includes("premium")) {
      return <Star className="w-5 h-5" />;
    } else {
      return <Package className="w-5 h-5" />;
    }
  };

  const getTotalRevenue = () => {
    return packages.reduce((total, pkg) => {
      const multiplier = pkg.billing_cycle === "monthly" ? 12 : 
                        pkg.billing_cycle === "quarterly" ? 4 : 1;
      return total + (pkg.price * pkg.subscriber_count * multiplier);
    }, 0);
  };

  const getTotalSubscribers = () => {
    return packages.reduce((total, pkg) => total + pkg.subscriber_count, 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-2">User Subscription Packages</h2>
          <p className="text-gray-600">
            Create and manage user subscription packages for account-based premium features and multi-event access
          </p>
        </div>
        
        <CustomButton
          buttonText="Create Package"
          prefixIcon={<Plus className="w-4 h-4" />}
          buttonColor="bg-purple-600"
          radius="rounded-md"
          onClick={() => handleOpenModal()}
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Subscribers</p>
              <p className="text-2xl font-semibold">{getTotalSubscribers()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Active Packages</p>
              <p className="text-2xl font-semibold">{packages.filter(p => p.is_active).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Annual Revenue</p>
              <p className="text-2xl font-semibold">${getTotalRevenue().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex space-x-8">
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "packages"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("packages")}
          >
            Packages
          </button>
          <button
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "analytics"
                ? "border-purple-500 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
        </div>
      </div>

      {/* Packages Tab */}
      {activeTab === "packages" && (
        <div className="space-y-4">
          {packages.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No packages yet</h3>
              <p className="text-gray-500 mb-4">
                Create subscription packages to offer premium features and recurring access
              </p>
              <CustomButton
                buttonText="Create First Package"
                prefixIcon={<Plus className="w-4 h-4" />}
                buttonColor="bg-purple-600"
                radius="rounded-md"
                onClick={() => handleOpenModal()}
              />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${
                    pkg.is_featured ? 'border-purple-500 shadow-lg relative' : ''
                  }`}
                >
                  {pkg.is_featured && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        pkg.is_featured ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {getPackageIcon(pkg.name)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                        <p className="text-2xl font-bold text-purple-600">
                          {formatPrice(pkg.price, pkg.currency, pkg.billing_cycle)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePackageStatus(pkg.id)}
                        className={`p-1 rounded ${pkg.is_active ? 'text-green-600' : 'text-gray-400'}`}
                        title={pkg.is_active ? "Active" : "Inactive"}
                      >
                        {pkg.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleOpenModal(pkg)}
                        className="p-1 text-gray-500 hover:text-blue-600 rounded"
                        title="Edit package"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="p-1 text-gray-500 hover:text-red-600 rounded"
                        title="Delete package"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {pkg.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <Check className="w-3 h-3 text-green-500" />
                          {feature}
                        </li>
                      ))}
                      {pkg.features.length > 4 && (
                        <li className="text-sm text-gray-500">+{pkg.features.length - 4} more features</li>
                      )}
                    </ul>
                  </div>

                  {/* Limits */}
                  <div className="mb-4 p-3 bg-gray-50 rounded">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Limits:</h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>Events: {pkg.limits.events_per_month === "unlimited" ? "Unlimited" : `${pkg.limits.events_per_month}/month`}</p>
                      <p>Guests: {pkg.limits.guests_per_event === "unlimited" ? "Unlimited" : `${pkg.limits.guests_per_event}/event`}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm border-t pt-3">
                    <span className="text-gray-500">{pkg.subscriber_count} subscribers</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      pkg.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {pkg.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Subscription Analytics</h3>
            <p className="text-gray-600 mb-4">
              Detailed analytics and insights about your subscription packages will be available here.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800">Revenue Breakdown</h4>
                <p className="text-sm text-blue-600">Monthly recurring revenue trends</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800">Conversion Rates</h4>
                <p className="text-sm text-green-600">Package conversion and churn analysis</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  {editingPackage ? "Edit Package" : "Create New Package"}
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
                    label="Package Name *"
                    placeholder="Enter package name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    isRequired={true}
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <InputWithFullBoarder
                      label="Price *"
                      type="number"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      isRequired={true}
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <select
                        value={formData.currency}
                        onChange={(e) => handleInputChange("currency", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      >
                        {currencies.map((currency) => (
                          <option key={currency.value} value={currency.value}>
                            {currency.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <InputWithFullBoarder
                  label="Description"
                  placeholder="Brief description of this package"
                  isTextArea={true}
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Billing Cycle
                    </label>
                    <select
                      value={formData.billing_cycle}
                      onChange={(e) => handleInputChange("billing_cycle", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    >
                      {billingCycles.map((cycle) => (
                        <option key={cycle.value} value={cycle.value}>
                          {cycle.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.billing_cycle !== "one_time" && (
                    <InputWithFullBoarder
                      label="Duration (Months)"
                      type="number"
                      placeholder="1"
                      value={formData.duration_months}
                      onChange={(e) => handleInputChange("duration_months", parseInt(e.target.value))}
                    />
                  )}
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Features
                  </label>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          placeholder={`Feature ${index + 1}`}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        />
                        <button
                          onClick={() => removeFeature(index)}
                          className="text-red-500 hover:text-red-700 px-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addFeature}
                      className="flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm"
                    >
                      <Plus className="h-3 w-3" />
                      Add Feature
                    </button>
                  </div>
                </div>

                {/* Limits */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Package Limits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputWithFullBoarder
                      label="Events per Month"
                      placeholder="Enter number or 'unlimited'"
                      value={formData.limits.events_per_month}
                      onChange={(e) => handleInputChange("limits.events_per_month", e.target.value)}
                    />
                    
                    <InputWithFullBoarder
                      label="Guests per Event"
                      placeholder="Enter number or 'unlimited'"
                      value={formData.limits.guests_per_event}
                      onChange={(e) => handleInputChange("limits.guests_per_event", e.target.value)}
                    />
                  </div>

                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Features Included
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {featureOptions.map((feature) => (
                        <label
                          key={feature}
                          className="flex items-center gap-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={formData.limits.features_included.includes(feature)}
                            onChange={() => handleFeatureIncludedToggle(feature)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="capitalize">{feature.replace(/_/g, ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => handleInputChange("is_active", e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Active Package</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_featured}
                      onChange={(e) => handleInputChange("is_featured", e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Featured Package</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <CustomButton
                    buttonText={editingPackage ? "Update Package" : "Create Package"}
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

export default SubscriptionManagementTab;