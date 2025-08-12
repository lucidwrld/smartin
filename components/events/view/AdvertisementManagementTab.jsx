"use client";

import React, { useState, useEffect } from "react";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import { toast } from "react-toastify";
import {
  Plus,
  Trash2,
  Edit2,
  Download,
  Send,
  BarChart3,
  Monitor,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  Percent,
  Zap,
  Image,
  Play,
  FileText,
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import StatusButton from "@/components/StatusButton";
import {
  CreateAdvertManager,
  useGetEventAdvertsManager,
  UpdateAdvertManager,
  DeleteAdvertManager,
} from "@/app/adverts/controllers/advertController";
import {
  useGetAdvertCategoriesManager,
  CreateAdvertCategoryManager,
} from "@/app/adverts/controllers/advertController";
import Loader from "@/components/Loader";
import AdvertCouponSystem from "@/components/adverts/AdvertCouponSystem";

const AdvertCard = ({
  advert,
  onEdit,
  onDelete,
  onToggleStatus,
  onViewDetails,
  isLoading,
}) => {
  const {
    id,
    name,
    description,
    price,
    currency,
    quantity,
    sold,
    status,
    category,
    sale_start_date,
    sale_end_date,
    revenue,
    is_free,
    dimensions,
    placement,
    format,
    duration,
    is_virtual,
    content_url,
    preview_image,
  } = advert;

  const available = quantity - sold;
  const soldPercentage = (sold / quantity) * 100;

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      case "sold_out":
        return "bg-red-100 text-red-800";
      case "ended":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case "banner":
        return <Image className="w-4 h-4" />;
      case "video":
        return <Play className="w-4 h-4" />;
      case "sponsored_post":
        return <FileText className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
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
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-brandOrange/10 rounded-lg flex items-center justify-center">
            {getFormatIcon(format)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg text-gray-900">{name}</h3>
              <span
                className={`px-2 py-1 text-xs rounded ${getStatusColor(
                  status
                )}`}
              >
                {status.replace("_", " ").toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-600">{description}</p>
            {is_virtual && dimensions && (
              <p className="text-xs text-gray-500 mt-1">Virtual Size: {dimensions}</p>
            )}
            {placement && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {placement}
              </p>
            )}
            {duration && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {duration}
              </p>
            )}
            {is_virtual && (
              <p className="text-xs text-blue-600 font-medium mt-1">📱 Virtual Advertisement</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(advert)}
            disabled={isLoading}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
            title="View advertisement details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(advert)}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
            title="Edit advertisement"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() =>
              onToggleStatus(id, status === "active" ? "paused" : "active")
            }
            disabled={isLoading}
            className={`p-2 rounded-full transition-colors ${
              status === "active"
                ? "text-yellow-500 hover:bg-yellow-50"
                : "text-green-500 hover:bg-green-50"
            }`}
            title={status === "active" ? "Pause sales" : "Resume sales"}
          >
            {status === "active" ? (
              <XCircle className="w-4 h-4" />
            ) : (
              <CheckCircle className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => onDelete(id)}
            disabled={isLoading}
            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Delete advertisement"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Price</p>
          <p className="font-semibold">
            {is_free ? "Free" : formatCurrency(price, currency)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Sold / Total</p>
          <p className="font-semibold">
            {sold} / {quantity}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Available</p>
          <p className="font-semibold">{available}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Revenue</p>
          <p className="font-semibold text-green-600">
            {formatCurrency(revenue || 0, currency)}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Sales Progress</span>
          <span>{soldPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-brandOrange h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(soldPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Sale Period: {formatDate(sale_start_date)} -{" "}
          {formatDate(sale_end_date)}
        </span>
        <span className="px-2 py-1 bg-brandOrange/10 text-brandOrange rounded text-xs">
          {category}
        </span>
      </div>
    </div>
  );
};

const AdvertOrderCard = ({ order, onViewDetails, onUpdateStatus, isLoading }) => {
  const {
    id,
    order_number,
    customer_name,
    customer_email,
    customer_phone,
    adverts,
    total_amount,
    currency,
    status,
    payment_status,
    order_date,
    payment_method,
    company_name,
    campaign_details,
  } = order;

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "refunded":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "N/A";
    }
  };

  const totalAdverts =
    adverts?.reduce((sum, advert) => sum + advert.quantity, 0) || 0;

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900">#{order_number}</h4>
            <span
              className={`px-2 py-1 text-xs rounded ${getStatusColor(status)}`}
            >
              {status.toUpperCase()}
            </span>
            <span
              className={`px-2 py-1 text-xs rounded ${getPaymentStatusColor(
                payment_status
              )}`}
            >
              {payment_status?.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {customer_name}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {customer_email}
            </span>
            {company_name && (
              <span className="flex items-center gap-1">
                <Monitor className="w-3 h-3" />
                {company_name}
              </span>
            )}
            {customer_phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {customer_phone}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(order_date)}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{totalAdverts} ad slot(s)</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(total_amount, currency)}
            </span>
            {payment_method && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                {payment_method}
              </span>
            )}
          </div>

          {campaign_details && (
            <div className="mt-2 text-xs text-gray-500">
              <p>Campaign: {campaign_details}</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={() => onViewDetails(order)}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
            title="View order details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <select
            value={status}
            onChange={(e) => onUpdateStatus(id, e.target.value)}
            className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-brandOrange"
            disabled={isLoading}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const AdvertisementManagementTab = ({ event }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAdvertModal, setShowAdvertModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewingAdvert, setViewingAdvert] = useState(null);
  const [editingAdvert, setEditingAdvert] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryFormData, setCategoryFormData] = useState({
    name: "",
  });
  const [formData, setFormData] = useState({
    event: event?.id,
    name: "",
    category: "",
    price: 0,
    description: "",
    quantity: 5,
    currency: "USD",
    sale_start_date: "",
    sale_end_date: "",
    min_per_order: 1,
    max_per_order: 3,
    is_active: true,
    requires_approval: false,
    is_free: false,
    dimensions: "",
    placement: "",
    format: "banner",
    duration: "",
    is_virtual: false,
    content_url: "",
    preview_image: "",
  });

  // API Integrations
  const {
    data: advertsData,
    isLoading: loadingAdverts,
    refetch: refetchAdverts,
  } = useGetEventAdvertsManager(event?.id || event?._id);
  const { data: categoriesData, refetch: refetchCategories } =
    useGetAdvertCategoriesManager();
  const { createAdvert, isLoading: creatingAdvert } = CreateAdvertManager();
  const { updateAdvert, isLoading: updatingAdvert } = UpdateAdvertManager({
    advertId: editingAdvert?._id,
  });
  const { deleteAdvert, isLoading: deletingAdvert } = DeleteAdvertManager({
    advertId: editingAdvert?._id,
  });
  const { createAdvertCategory, isLoading: creatingCategory } =
    CreateAdvertCategoryManager();

  const isLoading =
    creatingAdvert || updatingAdvert || deletingAdvert || creatingCategory;

  const mockOrders = [
    {
      id: "1",
      order_number: "AD001",
      customer_name: "Marketing Corp",
      customer_email: "contact@marketingcorp.com",
      customer_phone: "+1234567890",
      company_name: "Marketing Corp",
      adverts: [{ name: "Premium Banner - Main Stage", quantity: 1 }],
      total_amount: 5000,
      currency: "USD",
      status: "completed",
      payment_status: "paid",
      order_date: "2024-01-15",
      payment_method: "Credit Card",
      campaign_details: "New Product Launch Campaign",
    },
    {
      id: "2",
      order_number: "AD002",
      customer_name: "Tech Innovators",
      customer_email: "ads@techinnovators.com",
      customer_phone: "+1234567891",
      company_name: "Tech Innovators Inc",
      adverts: [{ name: "Digital Screen - Entrance", quantity: 3 }],
      total_amount: 6000,
      currency: "USD",
      status: "pending",
      payment_status: "pending",
      order_date: "2024-01-20",
      payment_method: "Bank Transfer",
      campaign_details: "AI Software Promotion",
    },
  ];

  const handleToggleAdvertStatus = async (advertId, newStatus) => {
    try {
      const advert = advertsData?.data.find((a) => a._id === advertId);
      if (!advert) return;

      const updateData = {
        name: advert.name,
        category:
          typeof advert.category === "object"
            ? advert.category._id
            : advert.category,
        price: advert.price,
        description: advert.description,
        format: advert.format,
        dimensions: advert.dimensions,
        placement: advert.placement,
        duration: advert.duration,
        quantity: advert.quantity,
        currency: advert.currency,
        sale_start_date: advert.sale_start_date.split("T")[0],
        sale_end_date: advert.sale_end_date.split("T")[0],
        min_per_order: advert.min_per_order,
        max_per_order: advert.max_per_order,
        is_active: newStatus === "active",
        requires_approval: advert.requires_approval,
        is_free: advert.is_free,
        is_virtual: advert.is_virtual,
      };

      await updateAdvert(updateData);
      await refetchAdverts();
    } catch (error) {
      console.error("Error updating advert status:", error);
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    console.log("Update order status:", orderId, newStatus);
  };

  const handleViewAdvertDetails = (advert) => {
    setViewingAdvert(advert);
    setShowDetailsModal(true);
  };

  const handleSaveAdvert = async () => {
    try {
      if (!formData.name || !formData.category) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (!formData.sale_start_date || !formData.sale_end_date) {
        toast.error("Please set sale start and end dates");
        return;
      }

      if (
        new Date(formData.sale_end_date) <= new Date(formData.sale_start_date)
      ) {
        toast.error("Sale end date must be after sale start date");
        return;
      }

      if (formData.quantity < 1) {
        toast.error("Quantity must be at least 1");
        return;
      }

      if (!formData.is_free && formData.price <= 0) {
        toast.error("Price must be greater than 0 for paid advertisements");
        return;
      }

      const advertData = {
        event: event?.id || event?._id,
        name: formData.name,
        category: formData.category,
        price: formData.price,
        description: formData.description,
        format: formData.format,
        dimensions: formData.dimensions,
        placement: formData.placement,
        duration: formData.duration,
        quantity: formData.quantity,
        currency: formData.currency,
        sale_start_date: formData.sale_start_date,
        sale_end_date: formData.sale_end_date,
        min_per_order: formData.min_per_order,
        max_per_order: formData.max_per_order,
        is_active: formData.is_active,
        requires_approval: formData.requires_approval,
        is_free: formData.is_free,
        is_virtual: formData.is_virtual,
      };

      if (editingAdvert) {
        await updateAdvert(advertData);
      } else {
        await createAdvert(advertData);
      }

      await refetchAdverts();
      setShowAdvertModal(false);
      setEditingAdvert(null);
    } catch (error) {
      console.error("Error saving advert:", error);
    }
  };

  const handleDeleteAdvert = async () => {
    try {
      await deleteAdvert();
      await refetchAdverts();
      document.getElementById("delete-advert").close();
    } catch (error) {
      console.error("Error deleting advert:", error);
    }
  };

  const handleSaveCategory = async () => {
    try {
      if (!categoryFormData.name) {
        toast.error("Please enter a category name");
        return;
      }

      await createAdvertCategory(categoryFormData);
      await refetchCategories();
      setShowCategoryModal(false);
      setCategoryFormData({ name: "" });
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "adverts", label: "Ad Slots", icon: Monitor },
    { id: "orders", label: "Orders", icon: Users },
    { id: "coupons", label: "Coupons", icon: Percent },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ];

  const adverts = advertsData?.data || [];
  const totalRevenue = 0; // Calculate from actual revenue data when available
  const totalSold = adverts.reduce((sum, advert) => sum + (advert.quantity - advert.quantity_remaining), 0);
  const totalAvailable = adverts.reduce((sum, advert) => sum + advert.quantity_remaining, 0);
  const activeTypes = adverts.filter(advert => advert.is_active).length;

  if (loadingAdverts) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-green-600">${totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Slots Sold</p>
              <p className="text-2xl font-semibold text-blue-600">{totalSold}</p>
            </div>
            <Monitor className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-2xl font-semibold text-mustard">{totalAvailable}</p>
            </div>
            <Users className="w-8 h-8 text-mustard" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Types</p>
              <p className="text-2xl font-semibold text-gray-900">{activeTypes}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      <div className="border-b">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? "border-brandOrange text-brandOrange"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
            <div className="space-y-3">
              {adverts.map((advert) => {
                const sold = advert.quantity - advert.quantity_remaining;
                const soldPercentage = (sold / advert.quantity) * 100;
                return (
                  <div key={advert._id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{advert.name}</span>
                      <span>
                        {sold}/{advert.quantity} (
                        {soldPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-brandOrange h-2 rounded-full"
                        style={{ width: `${Math.min(soldPercentage, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
            <div className="space-y-3">
              {mockOrders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex justify-between items-center py-2 border-b last:border-b-0"
                >
                  <div>
                    <p className="font-medium text-sm">{order.customer_name}</p>
                    <p className="text-xs text-gray-500">
                      #{order.order_number}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">${order.total_amount}</p>
                    <StatusButton status={order.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "adverts" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Advertisement Slots</h3>
            <div className="flex gap-3">
              <CustomButton
                buttonText="Add Category"
                prefixIcon={<Plus size={16} />}
                buttonColor="bg-gray-600"
                radius="rounded-full"
                onClick={() => {
                  setCategoryFormData({ name: "" });
                  setShowCategoryModal(true);
                }}
              />
              <CustomButton
                buttonText="Add Ad Slot"
                prefixIcon={<Plus size={16} />}
                buttonColor="bg-brandOrange"
                textColor="text-whiteColor"
                radius="rounded-full"
                onClick={() => {
                  setEditingAdvert(null);
                  setFormData({
                    event: event?.id,
                    name: "",
                    category: "",
                    price: 0,
                    description: "",
                    quantity: 5,
                    currency: "USD",
                    sale_start_date: "",
                    sale_end_date: "",
                    min_per_order: 1,
                    max_per_order: 3,
                    is_active: true,
                    requires_approval: false,
                    is_free: false,
                    dimensions: "",
                    placement: "",
                    format: "banner",
                    duration: "",
                  });
                  setShowAdvertModal(true);
                }}
              />
            </div>
          </div>

          {loadingAdverts ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brandOrange mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading advertisements...</p>
            </div>
          ) : adverts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <Monitor className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No advertisements yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first advertisement slot to start selling.
              </p>
              <CustomButton
                buttonText="Create First Advertisement"
                prefixIcon={<Plus size={16} />}
                buttonColor="bg-brandOrange"
                textColor="text-whiteColor"
                radius="rounded-full"
                onClick={() => {
                  setEditingAdvert(null);
                  setFormData({
                    event: event?.id,
                    name: "",
                    category: "",
                    price: 0,
                    description: "",
                    quantity: 5,
                    currency: "USD",
                    sale_start_date: "",
                    sale_end_date: "",
                    min_per_order: 1,
                    max_per_order: 3,
                    is_active: true,
                    requires_approval: false,
                    is_free: false,
                    dimensions: "",
                    placement: "",
                    format: "banner",
                    duration: "",
                    is_virtual: false,
                    content_url: "",
                    preview_image: "",
                  });
                  setShowAdvertModal(true);
                }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {adverts.map((advert) => (
                <AdvertCard
                  key={advert._id}
                  advert={{
                    ...advert,
                    id: advert._id,
                    sold: advert.quantity - advert.quantity_remaining,
                    status: advert.is_active
                      ? advert.sold_out
                        ? "sold_out"
                        : "active"
                      : "paused",
                    category:
                      typeof advert.category === "object"
                        ? advert.category.name
                        : advert.category,
                    revenue: 0, // Hardcoded as requested
                  }}
                  onViewDetails={handleViewAdvertDetails}
                  onEdit={() => {
                    setEditingAdvert(advert);
                    setFormData({
                      name: advert.name,
                      category:
                        typeof advert.category === "object"
                          ? advert.category._id
                          : advert.category,
                      price: advert.price,
                      description: advert.description || "",
                      quantity: advert.quantity,
                      currency: advert.currency,
                      sale_start_date:
                        advert.sale_start_date?.split("T")[0] || "",
                      sale_end_date: advert.sale_end_date?.split("T")[0] || "",
                      min_per_order: advert.min_per_order,
                      max_per_order: advert.max_per_order,
                      is_active: advert.is_active,
                      requires_approval: advert.requires_approval,
                      is_free: advert.is_free,
                      dimensions: advert.dimensions || "",
                      placement: advert.placement || "",
                      format: advert.format || "banner",
                      duration: advert.duration || "",
                      is_virtual: advert.is_virtual || false,
                      content_url: advert.content_url || "",
                      preview_image: advert.preview_image || "",
                    });
                    setShowAdvertModal(true);
                  }}
                  onDelete={() => {
                    setEditingAdvert(advert);
                    document.getElementById("delete-advert").showModal();
                  }}
                  onToggleStatus={() =>
                    handleToggleAdvertStatus(
                      advert._id,
                      advert.is_active ? "paused" : "active"
                    )
                  }
                  isLoading={isLoading}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h3 className="text-lg font-semibold">Advertisement Orders</h3>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandOrange"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brandOrange"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {mockOrders.map((order) => (
              <AdvertOrderCard
                key={order.id}
                order={order}
                onViewDetails={() => {}}
                onUpdateStatus={handleUpdateOrderStatus}
                isLoading={isLoading}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === "coupons" && <AdvertCouponSystem eventId={event?.id} />}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Advertisement Analytics</h3>
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Detailed analytics charts would be displayed here.</p>
              <p className="text-sm">
                Integration with charting library required.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Advertisement Details Modal */}
      {showDetailsModal && viewingAdvert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Advertisement Details</h3>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setViewingAdvert(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Side - Advertisement Content */}
                <div>
                  <h4 className="font-semibold text-lg mb-3">{viewingAdvert.name}</h4>
                  
                  {/* Preview Image/Content */}
                  {viewingAdvert.preview_image && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preview:
                      </label>
                      <div className="border rounded-lg overflow-hidden">
                        {viewingAdvert.format === "video" ? (
                          <div className="relative">
                            <img 
                              src={viewingAdvert.preview_image} 
                              alt="Video preview" 
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                              <Play className="w-12 h-12 text-white" />
                            </div>
                            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                              Video Advertisement
                            </div>
                          </div>
                        ) : (
                          <img 
                            src={viewingAdvert.preview_image} 
                            alt="Advertisement preview" 
                            className="w-full h-48 object-cover"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Content URL for Virtual Ads */}
                  {viewingAdvert.is_virtual && viewingAdvert.content_url && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content URL:
                      </label>
                      <a 
                        href={viewingAdvert.content_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        {viewingAdvert.content_url}
                      </a>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description:</label>
                      <p className="text-gray-600">{viewingAdvert.description}</p>
                    </div>

                    {viewingAdvert.is_virtual && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Monitor className="w-4 h-4 text-blue-600" />
                          <span className="font-medium text-blue-800">Virtual Advertisement</span>
                        </div>
                        <p className="text-sm text-blue-700">
                          This is a digital advertisement that will be displayed virtually during the event.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side - Advertisement Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category:</label>
                      <p className="text-gray-900">{viewingAdvert.category}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Format:</label>
                      <p className="text-gray-900 capitalize">{viewingAdvert.format}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Price:</label>
                      <p className="text-gray-900 font-semibold">
                        {viewingAdvert.is_free ? "Free" : `$${viewingAdvert.price}`}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Available Slots:</label>
                      <p className="text-gray-900">{viewingAdvert.quantity - viewingAdvert.sold} / {viewingAdvert.quantity}</p>
                    </div>
                  </div>

                  {viewingAdvert.dimensions && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        {viewingAdvert.is_virtual ? "Virtual " : ""}Dimensions:
                      </label>
                      <p className="text-gray-900">{viewingAdvert.dimensions}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Placement:</label>
                    <p className="text-gray-900">{viewingAdvert.placement}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Duration:</label>
                    <p className="text-gray-900">{viewingAdvert.duration}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sale Period:</label>
                      <p className="text-gray-900 text-sm">
                        {new Date(viewingAdvert.sale_start_date).toLocaleDateString()} - {new Date(viewingAdvert.sale_end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status:</label>
                      <span className={`px-2 py-1 text-xs rounded ${
                        viewingAdvert.status === "active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {viewingAdvert.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-2">Sales Performance</h5>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Sold:</span>
                        <span className="text-sm font-medium">{viewingAdvert.sold}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Revenue:</span>
                        <span className="text-sm font-medium text-green-600">${viewingAdvert.revenue?.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-brandOrange h-2 rounded-full"
                          style={{ width: `${(viewingAdvert.sold / viewingAdvert.quantity * 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 text-center">
                        {((viewingAdvert.sold / viewingAdvert.quantity) * 100).toFixed(1)}% sold
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <CustomButton
                  buttonText="Edit Advertisement"
                  buttonColor="bg-mustard"
                  textColor="text-black"
                  radius="rounded-md"
                  onClick={() => {
                    setEditingAdvert(viewingAdvert);
                    setFormData({
                      name: viewingAdvert.name,
                      category: viewingAdvert.category,
                      price: viewingAdvert.price,
                      description: viewingAdvert.description || "",
                      quantity: viewingAdvert.quantity,
                      currency: viewingAdvert.currency,
                      sale_start_date: viewingAdvert.sale_start_date,
                      sale_end_date: viewingAdvert.sale_end_date,
                      min_per_order: 1,
                      max_per_order: 3,
                      is_active: viewingAdvert.status === "active",
                      requires_approval: false,
                      is_free: viewingAdvert.is_free,
                      dimensions: viewingAdvert.dimensions || "",
                      placement: viewingAdvert.placement || "",
                      format: viewingAdvert.format || "banner",
                      duration: viewingAdvert.duration || "",
                      is_virtual: viewingAdvert.is_virtual || false,
                      content_url: viewingAdvert.content_url || "",
                      preview_image: viewingAdvert.preview_image || "",
                    });
                    setShowDetailsModal(false);
                    setViewingAdvert(null);
                    setShowAdvertModal(true);
                  }}
                />
                <CustomButton
                  buttonText="Close"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setViewingAdvert(null);
                  }}
                  buttonColor="bg-gray-300"
                  textColor="text-gray-700"
                  radius="rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add New Category</h3>
                <button
                  onClick={() => {
                    setShowCategoryModal(false);
                    setCategoryFormData({ name: "" });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <InputWithFullBoarder
                  label="Category Name *"
                  placeholder="Enter category name"
                  value={categoryFormData.name}
                  onChange={(e) =>
                    setCategoryFormData({
                      ...categoryFormData,
                      name: e.target.value,
                    })
                  }
                />

                <div className="flex gap-3 pt-4">
                  <CustomButton
                    buttonText="Create Category"
                    buttonColor="bg-gray-600"
                    radius="rounded-md"
                    isLoading={isLoading}
                    onClick={handleSaveCategory}
                  />
                  <CustomButton
                    buttonText="Cancel"
                    onClick={() => {
                      setShowCategoryModal(false);
                      setCategoryFormData({ name: "" });
                    }}
                    buttonColor="bg-gray-300"
                    textColor="text-gray-700"
                    radius="rounded-md"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showAdvertModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingAdvert ? "Edit Advertisement" : "Add New Advertisement"}
                </h3>
                <button
                  onClick={() => {
                    setShowAdvertModal(false);
                    setEditingAdvert(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Advertisement Name *"
                    placeholder="Enter advertisement name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-mustard focus:border-mustard"
                    >
                      <option value="">Select category</option>
                      {categoriesData?.data?.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <InputWithFullBoarder
                  label="Description"
                  placeholder="Brief description of the advertisement slot"
                  isTextArea={true}
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Format *
                    </label>
                    <select
                      value={formData.format}
                      onChange={(e) =>
                        setFormData({ ...formData, format: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-mustard focus:border-mustard"
                    >
                      <option value="banner">Banner</option>
                      <option value="video">Video</option>
                      <option value="sponsored_post">Sponsored Post</option>
                      <option value="digital_display">Digital Display</option>
                    </select>
                  </div>
                  <InputWithFullBoarder
                    label="Dimensions"
                    placeholder="e.g., 1920x1080 px or 10x8 ft"
                    value={formData.dimensions}
                    onChange={(e) =>
                      setFormData({ ...formData, dimensions: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Placement"
                    placeholder="e.g., Main Stage, Entrance, Social Media"
                    value={formData.placement}
                    onChange={(e) =>
                      setFormData({ ...formData, placement: e.target.value })
                    }
                  />
                  <InputWithFullBoarder
                    label="Duration"
                    placeholder="e.g., Full event, 30 seconds, 24 hours"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputWithFullBoarder
                    label="Price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                  <InputWithFullBoarder
                    label="Quantity"
                    type="number"
                    placeholder="5"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData({ ...formData, currency: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-mustard focus:border-mustard"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="NGN">NGN</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Sale Start Date"
                    type="date"
                    value={formData.sale_start_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sale_start_date: e.target.value,
                      })
                    }
                  />
                  <InputWithFullBoarder
                    label="Sale End Date"
                    type="date"
                    value={formData.sale_end_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sale_end_date: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Min per Order"
                    type="number"
                    placeholder="1"
                    value={formData.min_per_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        min_per_order: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                  <InputWithFullBoarder
                    label="Max per Order"
                    type="number"
                    placeholder="3"
                    value={formData.max_per_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_per_order: parseInt(e.target.value) || 3,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_free}
                      onChange={(e) =>
                        setFormData({ ...formData, is_free: e.target.checked })
                      }
                      className="mr-2"
                    />
                    Free Advertisement
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.requires_approval}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requires_approval: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    Requires Approval
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_virtual}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_virtual: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    Virtual Advertisement
                  </label>
                </div>

                {/* Virtual Advertisement Fields */}
                {formData.is_virtual && (
                  <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 flex items-center gap-2">
                      <Monitor className="w-4 h-4" />
                      Virtual Advertisement Settings
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputWithFullBoarder
                        label="Content URL"
                        placeholder="https://example.com/banner.jpg"
                        value={formData.content_url}
                        onChange={(e) =>
                          setFormData({ ...formData, content_url: e.target.value })
                        }
                      />
                      <InputWithFullBoarder
                        label="Preview Image URL"
                        placeholder="https://example.com/preview.jpg"
                        value={formData.preview_image}
                        onChange={(e) =>
                          setFormData({ ...formData, preview_image: e.target.value })
                        }
                      />
                    </div>
                    
                    <div className="text-sm text-blue-700 bg-blue-100 p-3 rounded">
                      <p className="font-medium mb-1">Virtual Advertisement Info:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Content URL: Direct link to your advertisement content</li>
                        <li>Preview Image: Thumbnail/preview for admin review</li>
                        <li>Dimensions: Virtual display size (e.g., 1920x1080 px)</li>
                        <li>This will be displayed digitally during the virtual event</li>
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <CustomButton
                    buttonText={
                      editingAdvert ? "Update Advertisement" : "Create Advertisement"
                    }
                    buttonColor="bg-brandOrange"
                    textColor="text-whiteColor"
                    radius="rounded-md"
                    isLoading={isLoading}
                    onClick={handleSaveAdvert}
                  />
                  <CustomButton
                    buttonText="Cancel"
                    onClick={() => {
                      setShowAdvertModal(false);
                      setEditingAdvert(null);
                    }}
                    buttonColor="bg-gray-300"
                    textColor="text-gray-700"
                    radius="rounded-md"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmationModal
        title="Delete Advertisement"
        body={`Are you sure you want to delete the advertisement "${editingAdvert?.name}"? This action cannot be undone.`}
        buttonText="Delete Advertisement"
        isLoading={isLoading}
        onClick={handleDeleteAdvert}
        id="delete-advert"
      />
    </div>
  );
};

export default AdvertisementManagementTab;