"use client";

import React, { useState, useEffect } from "react";
import CouponSystem from "@/components/tickets/CouponSystem";
import {
  Plus,
  Trash2,
  Edit2,
  Download,
  Send,
  BarChart3,
  Ticket,
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
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import StatusButton from "@/components/StatusButton";
import { 
  CreateTicketManager, 
  useGetEventTicketsManager, 
  UpdateTicketManager, 
  DeleteTicketManager 
} from "@/app/tickets/controllers/ticketController";
import { useGetTicketCategoriesManager } from "@/app/tickets/controllers/ticketCategoryController";

const TicketCard = ({ ticket, onEdit, onDelete, onToggleStatus, isLoading }) => {
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
  } = ticket;

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
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Ticket className="w-6 h-6 text-purple-600" />
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
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(ticket)}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
            title="Edit ticket"
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
            title="Delete ticket"
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

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Sales Progress</span>
          <span>{soldPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(soldPercentage, 100)}%` }}
          ></div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Sale Period: {formatDate(sale_start_date)} -{" "}
          {formatDate(sale_end_date)}
        </span>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
          {category}
        </span>
      </div>
    </div>
  );
};

const OrderCard = ({ order, onViewDetails, onUpdateStatus, isLoading }) => {
  const {
    id,
    order_number,
    customer_name,
    customer_email,
    customer_phone,
    tickets,
    total_amount,
    currency,
    status,
    payment_status,
    order_date,
    payment_method,
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

  const totalTickets =
    tickets?.reduce((sum, ticket) => sum + ticket.quantity, 0) || 0;

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
            <span>{totalTickets} ticket(s)</span>
            <span className="font-semibold text-green-600">
              {formatCurrency(total_amount, currency)}
            </span>
            {payment_method && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                {payment_method}
              </span>
            )}
          </div>
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
            className="text-xs px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
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

const TicketingManagementTab = ({ event }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [tickets, setTickets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: 0,
    description: "",
    quantity: 100,
    currency: "USD",
    sale_start_date: "",
    sale_end_date: "",
    min_per_order: 1,
    max_per_order: 10,
    is_active: true,
    requires_approval: false,
    is_free: false,
  });

  // API Integrations
  const { data: ticketsData, isLoading: loadingTickets, refetch: refetchTickets } = useGetEventTicketsManager(event?.id || event?._id);
  const { data: categoriesData } = useGetTicketCategoriesManager();
  const { createTicket, isLoading: creatingTicket } = CreateTicketManager();
  const { updateTicket, isLoading: updatingTicket } = UpdateTicketManager();
  const { deleteTicket, isLoading: deletingTicket } = DeleteTicketManager();

  const isLoading = creatingTicket || updatingTicket || deletingTicket;

  // Map API data to component format
  React.useEffect(() => {
    if (ticketsData?.data && Array.isArray(ticketsData.data)) {
      const mappedTickets = ticketsData.data.map(ticket => ({
        // Backend fields
        id: ticket._id,
        name: ticket.name,
        description: ticket.description || "",
        price: ticket.price,
        currency: ticket.currency,
        quantity: ticket.quantity,
        sale_start_date: ticket.sale_start_date,
        sale_end_date: ticket.sale_end_date,
        is_free: ticket.is_free,
        category: typeof ticket.category === 'object' ? ticket.category.name : ticket.category,
        categoryId: typeof ticket.category === 'object' ? ticket.category._id : ticket.category,
        min_per_order: ticket.min_per_order,
        max_per_order: ticket.max_per_order,
        requires_approval: ticket.requires_approval,
        is_active: ticket.is_active,
        sold_out: ticket.sold_out,
        quantity_remaining: ticket.quantity_remaining,
        
        // Calculated/Frontend fields
        sold: ticket.quantity - (ticket.quantity_remaining || ticket.quantity),
        status: ticket.is_active ? (ticket.sold_out ? "sold_out" : "active") : "paused",
        revenue: (ticket.quantity - (ticket.quantity_remaining || ticket.quantity)) * ticket.price,
      }));
      setTickets(mappedTickets);
    }
  }, [ticketsData]);

  // Initialize with empty orders (no endpoint available yet)
  React.useEffect(() => {
    // Orders endpoint not available yet, keeping empty
    setOrders([]);
  }, []);

  const handleToggleTicketStatus = async (ticketId, newStatus) => {
    try {
      const ticket = tickets.find(t => t.id === ticketId);
      if (!ticket) return;
      
      // Include ALL frontend data points
      const updateData = {
        name: ticket.name,
        category: ticket.categoryId,
        price: ticket.price,
        description: ticket.description,
        quantity: ticket.quantity,
        currency: ticket.currency,
        sale_start_date: ticket.sale_start_date.split('T')[0],
        sale_end_date: ticket.sale_end_date.split('T')[0],
        min_per_order: ticket.min_per_order,
        max_per_order: ticket.max_per_order,
        is_active: newStatus === "active",
        requires_approval: ticket.requires_approval,
        is_free: ticket.is_free,
        
        // Additional frontend fields
        status: newStatus,
        sale_start_time: ticket.sale_start_time,
        sale_end_time: ticket.sale_end_time,
        visible_quantity: ticket.visible_quantity,
        benefits: ticket.benefits,
      };
      
      await updateTicket({ 
        ticketId, 
        data: updateData,
        eventId: event?.id || event?._id 
      });
      await refetchTickets();
    } catch (error) {
      console.error("Error updating ticket status:", error);
      alert("Error updating ticket status. Please try again.");
    }
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleSaveTicket = async () => {
    try {
      if (!formData.name || !formData.category) {
        alert("Please fill in all required fields");
        return;
      }

      // Include ALL frontend data points
      const ticketData = {
        event: event?.id || event?._id,
        name: formData.name,
        category: formData.category,
        price: formData.price,
        description: formData.description,
        quantity: formData.quantity,
        currency: formData.currency,
        sale_start_date: formData.sale_start_date,
        sale_end_date: formData.sale_end_date,
        min_per_order: formData.min_per_order,
        max_per_order: formData.max_per_order,
        is_active: formData.is_active,
        requires_approval: formData.requires_approval,
        is_free: formData.is_free,

        // Additional frontend fields
        sale_start_time: formData.sale_start_time,
        sale_end_time: formData.sale_end_time,
        visible_quantity: formData.visible_quantity,
        benefits: formData.benefits || [],
      };

      if (editingTicket) {
        await updateTicket({
          ticketId: editingTicket.id,
          data: ticketData,
          eventId: event?.id || event?._id,
        });
      } else {
        await createTicket(ticketData);
      }

      await refetchTickets();
      setShowTicketModal(false);
      setEditingTicket(null);
    } catch (error) {
      console.error("Error saving ticket:", error);
      alert("Error saving ticket. Please try again.");
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!confirm("Are you sure you want to delete this ticket?")) {
      return;
    }

    try {
      await deleteTicket({ 
        ticketId, 
        eventId: event?.id || event?._id 
      });
      await refetchTickets();
    } catch (error) {
      console.error("Error deleting ticket:", error);
      alert("Error deleting ticket. Please try again.");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalRevenue = tickets.reduce(
    (sum, ticket) => sum + (ticket.revenue || 0),
    0
  );
  const totalSold = tickets.reduce((sum, ticket) => sum + ticket.sold, 0);
  const totalAvailable = tickets.reduce(
    (sum, ticket) => sum + (ticket.quantity - ticket.sold),
    0
  );
  const activeTickets = tickets.filter((t) => t.status === "active").length;

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "tickets", label: "Ticket Types", icon: Ticket },
    { id: "orders", label: "Orders", icon: Users },
    { id: "coupons", label: "Coupons", icon: Percent },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Header Stats */}
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
              <p className="text-sm text-gray-500">Tickets Sold</p>
              <p className="text-2xl font-semibold text-blue-600">
                {totalSold.toLocaleString()}
              </p>
            </div>
            <Ticket className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Available</p>
              <p className="text-2xl font-semibold text-purple-600">
                {totalAvailable.toLocaleString()}
              </p>
            </div>
            <Users className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Types</p>
              <p className="text-2xl font-semibold text-gray-900">
                {activeTickets}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
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
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Sales Overview</h3>
            <div className="space-y-3">
              {tickets.map((ticket) => {
                const soldPercentage = (ticket.sold / ticket.quantity) * 100;
                return (
                  <div key={ticket.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{ticket.name}</span>
                      <span>
                        {ticket.sold}/{ticket.quantity} (
                        {soldPercentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
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
              {orders.slice(0, 5).map((order) => (
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

      {activeTab === "tickets" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Ticket Types</h3>
            <CustomButton
              buttonText="Add Ticket Type"
              prefixIcon={<Plus size={16} />}
              buttonColor="bg-purple-600"
              radius="rounded-full"
              onClick={() => {
                setEditingTicket(null);
                setFormData({
                  name: "",
                  category: "",
                  price: 0,
                  description: "",
                  quantity: 100,
                  currency: "USD",
                  sale_start_date: "",
                  sale_end_date: "",
                  min_per_order: 1,
                  max_per_order: 10,
                  is_active: true,
                  requires_approval: false,
                  is_free: false,
                });
                setShowTicketModal(true);
              }}
            />
          </div>

          {loadingTickets ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading tickets...</p>
            </div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border">
              <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No tickets yet
              </h3>
              <p className="text-gray-500 mb-4">
                Create your first ticket type to start selling.
              </p>
              <CustomButton
                buttonText="Create First Ticket"
                prefixIcon={<Plus size={16} />}
                buttonColor="bg-purple-600"
                radius="rounded-full"
                onClick={() => {
                  setEditingTicket(null);
                  setFormData({
                    name: "",
                    category: "",
                    price: 0,
                    description: "",
                    quantity: 100,
                    currency: "USD",
                    sale_start_date: "",
                    sale_end_date: "",
                    min_per_order: 1,
                    max_per_order: 10,
                    is_active: true,
                    requires_approval: false,
                    is_free: false,
                  });
                  setShowTicketModal(true);
                }}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onEdit={() => {
                  setEditingTicket(ticket);
                  setFormData({
                    name: ticket.name,
                    category: ticket.categoryId || "",
                    price: ticket.price,
                    description: ticket.description || "",
                    quantity: ticket.quantity,
                    currency: ticket.currency,
                    sale_start_date: ticket.sale_start_date?.split('T')[0] || "",
                    sale_end_date: ticket.sale_end_date?.split('T')[0] || "",
                    min_per_order: ticket.min_per_order,
                    max_per_order: ticket.max_per_order,
                    is_active: ticket.is_active,
                    requires_approval: ticket.requires_approval,
                    is_free: ticket.is_free,
                  });
                  setShowTicketModal(true);
                }}
                onDelete={handleDeleteTicket}
                onToggleStatus={handleToggleTicketStatus}
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
            <h3 className="text-lg font-semibold">Orders</h3>
            <div className="flex gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={() => {}}
                onUpdateStatus={handleUpdateOrderStatus}
                isLoading={isLoading}
              />
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your search or filters."
                  : "Orders will appear here once people start purchasing tickets."}
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "coupons" && <CouponSystem eventId={event?.id} />}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Sales Analytics</h3>
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

      {/* Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingTicket ? "Edit Ticket" : "Add New Ticket"}
                </h3>
                <button
                  onClick={() => {
                    setShowTicketModal(false);
                    setEditingTicket(null);
                    setFormData({
                      name: "",
                      category: "",
                      price: 0,
                      description: "",
                      quantity: 100,
                      currency: "USD",
                      sale_start_date: "",
                      sale_end_date: "",
                      min_per_order: 1,
                      max_per_order: 10,
                      is_active: true,
                      requires_approval: false,
                      is_free: false,
                    });
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Ticket Name *"
                    placeholder="Enter ticket name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
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
                  placeholder="Brief description of the ticket"
                  isTextArea={true}
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputWithFullBoarder
                    label="Price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  />
                  <InputWithFullBoarder
                    label="Quantity"
                    type="number"
                    placeholder="100"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
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
                    onChange={(e) => setFormData({ ...formData, sale_start_date: e.target.value })}
                  />
                  <InputWithFullBoarder
                    label="Sale End Date"
                    type="date"
                    value={formData.sale_end_date}
                    onChange={(e) => setFormData({ ...formData, sale_end_date: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Min per Order"
                    type="number"
                    placeholder="1"
                    value={formData.min_per_order}
                    onChange={(e) => setFormData({ ...formData, min_per_order: parseInt(e.target.value) || 1 })}
                  />
                  <InputWithFullBoarder
                    label="Max per Order"
                    type="number"
                    placeholder="10"
                    value={formData.max_per_order}
                    onChange={(e) => setFormData({ ...formData, max_per_order: parseInt(e.target.value) || 10 })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_free}
                      onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                      className="mr-2"
                    />
                    Free Ticket
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.requires_approval}
                      onChange={(e) => setFormData({ ...formData, requires_approval: e.target.checked })}
                      className="mr-2"
                    />
                    Requires Approval
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <CustomButton
                    buttonText={
                      editingTicket ? "Update Ticket" : "Create Ticket"
                    }
                    buttonColor="bg-purple-600"
                    radius="rounded-md"
                    isLoading={isLoading}
                    onClick={handleSaveTicket}
                  />
                  <CustomButton
                    buttonText="Cancel"
                    onClick={() => {
                      setShowTicketModal(false);
                      setEditingTicket(null);
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
    </div>
  );
};

export default TicketingManagementTab;
