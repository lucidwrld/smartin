"use client";

import React, { useState } from "react";
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

const TicketCard = ({ ticket, onEdit, onToggleStatus, isLoading }) => {
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
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  // Initialize with mock data
  React.useEffect(() => {
    // Mock tickets data
    setTickets([
      {
        id: "ticket_1",
        name: "General Admission",
        description: "Standard access to all sessions",
        price: 99.99,
        currency: "USD",
        quantity: 500,
        sold: 387,
        status: "active",
        category: "General",
        sale_start_date: "2024-01-01",
        sale_end_date: "2024-03-15",
        revenue: 38613,
        is_free: false,
      },
      {
        id: "ticket_2",
        name: "VIP Access",
        description: "Premium access with exclusive benefits",
        price: 299.99,
        currency: "USD",
        quantity: 100,
        sold: 78,
        status: "active",
        category: "VIP",
        sale_start_date: "2024-01-01",
        sale_end_date: "2024-03-15",
        revenue: 23399.22,
        is_free: false,
      },
      {
        id: "ticket_3",
        name: "Student Discount",
        description: "Discounted tickets for students",
        price: 49.99,
        currency: "USD",
        quantity: 200,
        sold: 145,
        status: "active",
        category: "Student",
        sale_start_date: "2024-01-15",
        sale_end_date: "2024-03-15",
        revenue: 7248.55,
        is_free: false,
      },
      {
        id: "ticket_4",
        name: "Free Registration",
        description: "Complimentary access for partners",
        price: 0,
        currency: "USD",
        quantity: 50,
        sold: 42,
        status: "paused",
        category: "Complimentary",
        sale_start_date: "2024-01-01",
        sale_end_date: "2024-03-15",
        revenue: 0,
        is_free: true,
      },
    ]);

    // Mock orders data
    setOrders([
      {
        id: "order_1",
        order_number: "ORD-001234",
        customer_name: "John Smith",
        customer_email: "john.smith@email.com",
        customer_phone: "+1-555-0123",
        tickets: [
          {
            ticket_id: "ticket_1",
            ticket_name: "General Admission",
            quantity: 2,
            price: 99.99,
          },
        ],
        total_amount: 199.98,
        currency: "USD",
        status: "completed",
        payment_status: "paid",
        order_date: "2024-02-15T10:30:00Z",
        payment_method: "Credit Card",
      },
      {
        id: "order_2",
        order_number: "ORD-001235",
        customer_name: "Sarah Johnson",
        customer_email: "sarah.j@email.com",
        customer_phone: "+1-555-0124",
        tickets: [
          {
            ticket_id: "ticket_2",
            ticket_name: "VIP Access",
            quantity: 1,
            price: 299.99,
          },
        ],
        total_amount: 299.99,
        currency: "USD",
        status: "completed",
        payment_status: "paid",
        order_date: "2024-02-14T15:45:00Z",
        payment_method: "PayPal",
      },
      {
        id: "order_3",
        order_number: "ORD-001236",
        customer_name: "Mike Chen",
        customer_email: "mike.chen@email.com",
        tickets: [
          {
            ticket_id: "ticket_3",
            ticket_name: "Student Discount",
            quantity: 1,
            price: 49.99,
          },
        ],
        total_amount: 49.99,
        currency: "USD",
        status: "pending",
        payment_status: "pending",
        order_date: "2024-02-16T09:15:00Z",
        payment_method: "Bank Transfer",
      },
    ]);
  }, []);

  const handleToggleTicketStatus = (ticketId, newStatus) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
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
                setShowTicketModal(true);
              }}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onEdit={() => {
                  setEditingTicket(ticket);
                  setShowTicketModal(true);
                }}
                onToggleStatus={handleToggleTicketStatus}
                isLoading={isLoading}
              />
            ))}
          </div>
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
                  onClick={() => setShowTicketModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Ticket Name *"
                    placeholder="Enter ticket name"
                    defaultValue={editingTicket?.name || ""}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      defaultValue={editingTicket?.category || "general"}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="general">General Admission</option>
                      <option value="vip">VIP</option>
                      <option value="early_bird">Early Bird</option>
                      <option value="student">Student</option>
                      <option value="group">Group</option>
                    </select>
                  </div>
                </div>

                <InputWithFullBoarder
                  label="Description"
                  placeholder="Brief description of the ticket"
                  isTextArea={true}
                  rows={2}
                  defaultValue={editingTicket?.description || ""}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputWithFullBoarder
                    label="Price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    defaultValue={editingTicket?.price || ""}
                  />
                  <InputWithFullBoarder
                    label="Quantity"
                    type="number"
                    placeholder="100"
                    defaultValue={editingTicket?.quantity || ""}
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select
                      defaultValue={editingTicket?.currency || "USD"}
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
                    defaultValue={editingTicket?.sale_start_date || ""}
                  />
                  <InputWithFullBoarder
                    label="Sale End Date"
                    type="date"
                    defaultValue={editingTicket?.sale_end_date || ""}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Min per Order"
                    type="number"
                    placeholder="1"
                    defaultValue={editingTicket?.min_per_order || 1}
                  />
                  <InputWithFullBoarder
                    label="Max per Order"
                    type="number"
                    placeholder="10"
                    defaultValue={editingTicket?.max_per_order || 10}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={editingTicket?.is_free || false}
                      className="mr-2"
                    />
                    Free Ticket
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={editingTicket?.requires_approval || false}
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
                    onClick={() => {
                      // Here you would handle the save logic
                      setShowTicketModal(false);
                    }}
                  />
                  <CustomButton
                    buttonText="Cancel"
                    onClick={() => setShowTicketModal(false)}
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
