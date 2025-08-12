"use client";

import React, { useState, useEffect } from "react";
import DeleteConfirmationModal from "@/components/DeleteConfirmationModal";
import {
  Plus,
  Trash2,
  Edit2,
  Download,
  Send,
  BarChart3,
  Building,
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
  MapPin,
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import StatusButton from "@/components/StatusButton";
import {
  CreateBoothManager,
  useGetEventBoothsManager,
  UpdateBoothManager,
  DeleteBoothManager,
} from "@/app/booths/controllers/boothController";
import {
  useGetBoothCategoriesManager,
  CreateBoothCategoryManager,
} from "@/app/booths/controllers/boothController";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";
import BoothCouponSystem from "@/components/booths/BoothCouponSystem";

const BoothCard = ({ booth, onEdit, onDelete, onToggleStatus, isLoading }) => {
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
    size,
    location,
  } = booth;

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
          <div className="w-12 h-12 bg-brandPurple/10 rounded-lg flex items-center justify-center">
            <Building className="w-6 h-6 text-brandPurple" />
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
            {size && <p className="text-xs text-gray-500 mt-1">Size: {size}</p>}
            {location && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {location}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(booth)}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
            title="Edit booth"
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
            title="Delete booth"
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
            className="bg-brandPurple h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(soldPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Sale Period: {formatDate(sale_start_date)} -{" "}
          {formatDate(sale_end_date)}
        </span>
        <span className="px-2 py-1 bg-olive/10 text-olive rounded text-xs">
          {category}
        </span>
      </div>
    </div>
  );
};

const BoothOrderCard = ({
  order,
  onViewDetails,
  onUpdateStatus,
  isLoading,
}) => {
  const {
    id,
    order_number,
    customer_name,
    customer_email,
    customer_phone,
    booths,
    total_amount,
    currency,
    status,
    payment_status,
    order_date,
    payment_method,
    company_name,
    booth_info,
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

  const totalBooths =
    booths?.reduce((sum, booth) => sum + booth.quantity, 0) || 0;

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
                <Building className="w-3 h-3" />
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
            <span>{totalBooths} booth(s)</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(total_amount, currency)}
            </span>
            {payment_method && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                {payment_method}
              </span>
            )}
          </div>

          {booth_info && (
            <div className="mt-2 text-xs text-gray-500">
              <p>Booth Info: {booth_info}</p>
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
            className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-olive"
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

const BoothManagementTab = ({ event }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showBoothModal, setShowBoothModal] = useState(false);
  const [editingBooth, setEditingBooth] = useState(null);
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
    quantity: 10,
    currency: "USD",
    sale_start_date: "",
    sale_end_date: "",
    min_per_order: 1,
    max_per_order: 5,
    is_active: true,
    requires_approval: false,
    is_free: false,
    size: "",
    location: "",
    amenities: [],
  });

  // API Integrations
  const {
    data: boothsData,
    isLoading: loadingBooths,
    refetch: refetchBooths,
  } = useGetEventBoothsManager(event?.id || event?._id);
  const { data: categoriesData, refetch: refetchCategories } =
    useGetBoothCategoriesManager();
  const { createBooth, isLoading: creatingBooth } = CreateBoothManager();
  const { updateBooth, isLoading: updatingBooth } = UpdateBoothManager({
    boothId: editingBooth?._id,
  });
  const { deleteBooth, isLoading: deletingBooth } = DeleteBoothManager({
    boothId: editingBooth?._id,
  });
  const { createBoothCategory, isLoading: creatingCategory } =
    CreateBoothCategoryManager();

  const isLoading =
    creatingBooth || updatingBooth || deletingBooth || creatingCategory;

  const mockOrders = [
    {
      id: "1",
      order_number: "BT001",
      customer_name: "Tech Solutions Inc",
      customer_email: "contact@techsolutions.com",
      customer_phone: "+1234567890",
      company_name: "Tech Solutions Inc",
      booths: [{ name: "Premium Corner Booth", quantity: 1 }],
      total_amount: 2500,
      currency: "USD",
      status: "completed",
      payment_status: "paid",
      order_date: "2024-01-15",
      payment_method: "Credit Card",
      booth_info: "Display latest tech products",
    },
  ];

  const handleToggleBoothStatus = async (boothId, newStatus) => {
    try {
      const booth = boothsData?.data.find((b) => b._id === boothId);
      if (!booth) return;

      const updateData = {
        name: booth.name,
        category:
          typeof booth.category === "object"
            ? booth.category._id
            : booth.category,
        price: booth.price,
        description: booth.description,
        size: booth.size,
        location: booth.location,
        quantity: booth.quantity,
        currency: booth.currency,
        sale_start_date: booth.sale_start_date.split("T")[0],
        sale_end_date: booth.sale_end_date.split("T")[0],
        min_per_order: booth.min_per_order,
        max_per_order: booth.max_per_order,
        is_active: newStatus === "active",
        requires_approval: booth.requires_approval,
        is_free: booth.is_free,
      };

      await updateBooth(updateData);
      await refetchBooths();
    } catch (error) {
      console.error("Error updating booth status:", error);
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    console.log("Update order status:", orderId, newStatus);
  };

  const handleSaveBooth = async () => {
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
        toast.error("Price must be greater than 0 for paid booths");
        return;
      }

      const boothData = {
        event: event?.id || event?._id,
        name: formData.name,
        category: formData.category,
        price: formData.price,
        description: formData.description,
        size: formData.size,
        location: formData.location,
        quantity: formData.quantity,
        currency: formData.currency,
        sale_start_date: formData.sale_start_date,
        sale_end_date: formData.sale_end_date,
        min_per_order: formData.min_per_order,
        max_per_order: formData.max_per_order,
        is_active: formData.is_active,
        requires_approval: formData.requires_approval,
        is_free: formData.is_free,
      };

      if (editingBooth) {
        await updateBooth(boothData);
      } else {
        await createBooth(boothData);
      }

      await refetchBooths();
      setShowBoothModal(false);
      setEditingBooth(null);
    } catch (error) {
      console.error("Error saving booth:", error);
    }
  };

  const handleDeleteBooth = async () => {
    try {
      await deleteBooth();
      await refetchBooths();
      document.getElementById("delete-booth").close();
    } catch (error) {
      console.error("Error deleting booth:", error);
    }
  };

  const handleSaveCategory = async () => {
    try {
      if (!categoryFormData.name) {
        toast.error("Please enter a category name");
        return;
      }

      await createBoothCategory(categoryFormData);
      await refetchCategories();
      setShowCategoryModal(false);
      setCategoryFormData({ name: "" });
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "booths", label: "Booth Types", icon: Building },
    { id: "orders", label: "Orders", icon: Users },
    { id: "coupons", label: "Coupons", icon: Percent },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ];

  const booths = boothsData?.data || [];
  const totalRevenue = 0; // Calculate from actual revenue data when available
  const totalSold = booths.reduce(
    (sum, booth) => sum + (booth.quantity - booth.quantity_remaining),
    0
  );
  const totalAvailable = booths.reduce(
    (sum, booth) => sum + booth.quantity_remaining,
    0
  );
  const activeTypes = booths.filter((booth) => booth.is_active).length;

  if (loadingBooths) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-green-600">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Booths Sold</p>
              <p className="text-2xl font-semibold text-blue-600">
                {totalSold}
              </p>
            </div>
            <Building className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-2xl font-semibold text-olive">
                {totalAvailable}
              </p>
            </div>
            <Users className="w-8 h-8 text-olive" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Types</p>
              <p className="text-2xl font-semibold text-gray-900">
                {activeTypes}
              </p>
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
                  ? "border-olive text-olive"
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
              {booths.map((booth) => {
                const sold = booth.quantity - booth.quantity_remaining;
                const soldPercentage = (sold / booth.quantity) * 100;
                return (
                  <div key={booth._id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{booth.name}</span>
                      <span>
                        {sold}/{booth.quantity} ({soldPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className=" h-2 rounded-full"
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

      {activeTab === "booths" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Booth Types</h3>
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
                buttonText="Add Booth"
                prefixIcon={<Plus size={16} />}
                radius="rounded-full"
                onClick={() => {
                  setEditingBooth(null);
                  setFormData({
                    event: event?.id,
                    name: "",
                    category: "",
                    price: 0,
                    description: "",
                    quantity: 10,
                    currency: "USD",
                    sale_start_date: "",
                    sale_end_date: "",
                    min_per_order: 1,
                    max_per_order: 5,
                    is_active: true,
                    requires_approval: false,
                    is_free: false,
                    size: "",
                    location: "",
                    amenities: [],
                  });
                  setShowBoothModal(true);
                }}
              />
            </div>
          </div>

          {loadingBooths ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-olive mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading booths...</p>
            </div>
          ) : booths.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <Building className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No booths yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first booth type to start selling.
              </p>
              <CustomButton
                buttonText="Create First Booth"
                prefixIcon={<Plus size={16} />}
                radius="rounded-full"
                onClick={() => {
                  setEditingBooth(null);
                  setFormData({
                    event: event?.id,
                    name: "",
                    category: "",
                    price: 0,
                    description: "",
                    quantity: 10,
                    currency: "USD",
                    sale_start_date: "",
                    sale_end_date: "",
                    min_per_order: 1,
                    max_per_order: 5,
                    is_active: true,
                    requires_approval: false,
                    is_free: false,
                    size: "",
                    location: "",
                    amenities: [],
                  });
                  setShowBoothModal(true);
                }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {booths.map((booth) => (
                <BoothCard
                  key={booth._id}
                  booth={{
                    ...booth,
                    id: booth._id,
                    sold: booth.quantity - booth.quantity_remaining,
                    status: booth.is_active
                      ? booth.sold_out
                        ? "sold_out"
                        : "active"
                      : "paused",
                    category:
                      typeof booth.category === "object"
                        ? booth.category.name
                        : booth.category,
                    revenue: 0, // Hardcoded as requested
                  }}
                  onEdit={() => {
                    setEditingBooth(booth);
                    setFormData({
                      name: booth.name,
                      category:
                        typeof booth.category === "object"
                          ? booth.category._id
                          : booth.category,
                      price: booth.price,
                      description: booth.description || "",
                      quantity: booth.quantity,
                      currency: booth.currency,
                      sale_start_date:
                        booth.sale_start_date?.split("T")[0] || "",
                      sale_end_date: booth.sale_end_date?.split("T")[0] || "",
                      min_per_order: booth.min_per_order,
                      max_per_order: booth.max_per_order,
                      is_active: booth.is_active,
                      requires_approval: booth.requires_approval,
                      is_free: booth.is_free,
                      size: booth.size || "",
                      location: booth.location || "",
                      amenities: booth.amenities || [],
                    });
                    setShowBoothModal(true);
                  }}
                  onDelete={() => {
                    setEditingBooth(booth);
                    document.getElementById("delete-booth").showModal();
                  }}
                  onToggleStatus={() =>
                    handleToggleBoothStatus(
                      booth._id,
                      booth.is_active ? "paused" : "active"
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
            <h3 className="text-lg font-semibold">Booth Orders</h3>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
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
              <BoothOrderCard
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

      {activeTab === "coupons" && <BoothCouponSystem eventId={event?.id} />}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">
              Booth Sales Analytics
            </h3>
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

      {showBoothModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingBooth ? "Edit Booth" : "Add New Booth"}
                </h3>
                <button
                  onClick={() => {
                    setShowBoothModal(false);
                    setEditingBooth(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Booth Name *"
                    placeholder="Enter booth name"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-olive focus:border-olive"
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
                  placeholder="Brief description of the booth"
                  isTextArea={true}
                  rows={2}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Size"
                    placeholder="e.g., 10x10 ft"
                    value={formData.size}
                    onChange={(e) =>
                      setFormData({ ...formData, size: e.target.value })
                    }
                  />
                  <InputWithFullBoarder
                    label="Location"
                    placeholder="e.g., Main Hall - Corner"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
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
                    placeholder="10"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-olive focus:border-olive"
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
                    placeholder="5"
                    value={formData.max_per_order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_per_order: parseInt(e.target.value) || 5,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_free}
                      onChange={(e) =>
                        setFormData({ ...formData, is_free: e.target.checked })
                      }
                      className="mr-2"
                    />
                    Free Booth
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
                </div>

                <div className="flex gap-3 pt-4">
                  <CustomButton
                    buttonText={editingBooth ? "Update Booth" : "Create Booth"}
                    radius="rounded-md"
                    isLoading={isLoading}
                    onClick={handleSaveBooth}
                  />
                  <CustomButton
                    buttonText="Cancel"
                    onClick={() => {
                      setShowBoothModal(false);
                      setEditingBooth(null);
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
        title="Delete Booth"
        body={`Are you sure you want to delete the booth "${editingBooth?.name}"? This action cannot be undone.`}
        buttonText="Delete Booth"
        isLoading={isLoading}
        onClick={handleDeleteBooth}
        id="delete-booth"
      />
    </div>
  );
};

export default BoothManagementTab;
