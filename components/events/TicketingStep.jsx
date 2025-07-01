import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Ticket,
  Edit2,
  Users,
  DollarSign,
  Calendar,
  Clock,
  Settings,
} from "lucide-react";
import InputWithFullBoarder from "../InputWithFullBoarder";
import CustomButton from "../Button";

export const TicketingStep = ({ formData, onFormDataChange }) => {
  const [activeTab, setActiveTab] = useState("tickets");
  const [showAddTicket, setShowAddTicket] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  const [newTicket, setNewTicket] = useState({
    name: "",
    description: "",
    price: "",
    currency: "USD",
    quantity: "",
    sale_start_date: "",
    sale_start_time: "",
    sale_end_date: "",
    sale_end_time: "",
    is_free: false,
    requires_approval: false,
    visible_quantity: true,
    min_per_order: 1,
    max_per_order: 10,
    category: "general",
    benefits: [],
  });

  const tickets = formData.tickets || [];
  const ticketingEnabled = formData.enable_ticketing || false;

  const ticketCategories = [
    { value: "general", label: "General Admission" },
    { value: "vip", label: "VIP" },
    { value: "early_bird", label: "Early Bird" },
    { value: "student", label: "Student" },
    { value: "group", label: "Group" },
    { value: "premium", label: "Premium" },
    { value: "standard", label: "Standard" },
    { value: "other", label: "Other" },
  ];

  const currencies = [
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
    { value: "GBP", label: "GBP (£)" },
    { value: "NGN", label: "NGN (₦)" },
    { value: "CAD", label: "CAD (C$)" },
  ];

  // Ticket Management
  const handleToggleTicketing = () => {
    onFormDataChange("enable_ticketing", !ticketingEnabled);
  };

  const handleAddTicket = () => {
    if (!newTicket.name.trim()) {
      alert("Please enter ticket name");
      return;
    }

    if (!newTicket.is_free && (!newTicket.price || newTicket.price <= 0)) {
      alert("Please enter a valid price for paid tickets");
      return;
    }

    if (!newTicket.quantity || newTicket.quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    const ticketToAdd = {
      id: `ticket_${Date.now()}`,
      ...newTicket,
      price: newTicket.is_free ? 0 : parseFloat(newTicket.price),
      quantity: parseInt(newTicket.quantity),
      min_per_order: parseInt(newTicket.min_per_order),
      max_per_order: parseInt(newTicket.max_per_order),
      sold: 0,
      status: "active",
    };

    const updatedTickets = [...tickets, ticketToAdd];
    onFormDataChange("tickets", updatedTickets);

    setNewTicket({
      name: "",
      description: "",
      price: "",
      currency: "USD",
      quantity: "",
      sale_start_date: "",
      sale_start_time: "",
      sale_end_date: "",
      sale_end_time: "",
      is_free: false,
      requires_approval: false,
      visible_quantity: true,
      min_per_order: 1,
      max_per_order: 10,
      category: "general",
      benefits: [],
    });
    setShowAddTicket(false);
  };

  const handleRemoveTicket = (ticketId) => {
    const updatedTickets = tickets.filter((ticket) => ticket.id !== ticketId);
    onFormDataChange("tickets", updatedTickets);
  };

  const handleTicketChange = (ticketId, field, value) => {
    const updatedTickets = tickets.map((ticket) =>
      ticket.id === ticketId ? { ...ticket, [field]: value } : ticket
    );
    onFormDataChange("tickets", updatedTickets);
  };

  const getCategoryLabel = (category) => {
    const categoryData = ticketCategories.find((c) => c.value === category);
    return categoryData ? categoryData.label : category;
  };

  const getCurrencySymbol = (currency) => {
    const currencyData = currencies.find((c) => c.value === currency);
    return currencyData ? currencyData.label.split("(")[1].replace(")", "") : "$";
  };

  const getTicketStatusColor = (ticket) => {
    const now = new Date();
    const saleStart = new Date(`${ticket.sale_start_date} ${ticket.sale_start_time}`);
    const saleEnd = new Date(`${ticket.sale_end_date} ${ticket.sale_end_time}`);
    
    if (ticket.sold >= ticket.quantity) return "bg-red-100 text-red-800";
    if (now < saleStart) return "bg-yellow-100 text-yellow-800";
    if (now > saleEnd) return "bg-gray-100 text-gray-800";
    return "bg-green-100 text-green-800";
  };

  const getTicketStatus = (ticket) => {
    const now = new Date();
    const saleStart = new Date(`${ticket.sale_start_date} ${ticket.sale_start_time}`);
    const saleEnd = new Date(`${ticket.sale_end_date} ${ticket.sale_end_time}`);
    
    if (ticket.sold >= ticket.quantity) return "Sold Out";
    if (now < saleStart) return "Not Started";
    if (now > saleEnd) return "Sale Ended";
    return "On Sale";
  };

  return (
    <div className="flex flex-col w-full text-brandBlack">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Event Ticketing</h2>
        <p className="text-gray-600">
          Set up ticket types and pricing for your event. You can create different
          ticket categories with various pricing options, limits, and sale periods.
        </p>
      </div>

      {/* Enable Ticketing Toggle */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-lg">Enable Ticketing</h3>
            <p className="text-sm text-gray-600">
              Turn on ticketing to sell tickets for your event
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={ticketingEnabled}
              onChange={handleToggleTicketing}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>

      {ticketingEnabled && (
        <>
          {/* Tabs */}
          <div className="mb-6">
            <div className="flex border-b">
              {[
                { id: "tickets", label: "Ticket Types", icon: Ticket },
                { id: "settings", label: "Ticketing Settings", icon: Settings },
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

          {/* Tickets Tab */}
          {activeTab === "tickets" && (
            <div className="space-y-6">
              {/* Existing Tickets */}
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Ticket className="h-8 w-8 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-lg">{ticket.name}</h3>
                            <span
                              className={`px-2 py-1 text-xs rounded ${getTicketStatusColor(
                                ticket
                              )}`}
                            >
                              {getTicketStatus(ticket)}
                            </span>
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              {getCategoryLabel(ticket.category)}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Price:</span>
                              <p className="font-medium">
                                {ticket.is_free
                                  ? "Free"
                                  : `${getCurrencySymbol(ticket.currency)}${ticket.price}`}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500">Available:</span>
                              <p className="font-medium">
                                {ticket.quantity - ticket.sold} / {ticket.quantity}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500">Sale Period:</span>
                              <p className="font-medium">
                                {ticket.sale_start_date} - {ticket.sale_end_date}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500">Order Limits:</span>
                              <p className="font-medium">
                                Min: {ticket.min_per_order}, Max: {ticket.max_per_order}
                              </p>
                            </div>
                          </div>

                          {ticket.description && (
                            <p className="text-sm text-gray-600 mt-2">
                              {ticket.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setEditingTicket(
                              editingTicket === ticket.id ? null : ticket.id
                            )
                          }
                          className="text-blue-500 hover:text-blue-700 p-1"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveTicket(ticket.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Edit Ticket Form */}
                    {editingTicket === ticket.id && (
                      <div className="border-t pt-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <InputWithFullBoarder
                            label="Ticket Name"
                            value={ticket.name}
                            onChange={(e) =>
                              handleTicketChange(ticket.id, "name", e.target.value)
                            }
                          />
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Category
                            </label>
                            <select
                              value={ticket.category}
                              onChange={(e) =>
                                handleTicketChange(ticket.id, "category", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            >
                              {ticketCategories.map((category) => (
                                <option key={category.value} value={category.value}>
                                  {category.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <InputWithFullBoarder
                          label="Description"
                          isTextArea={true}
                          rows={2}
                          value={ticket.description}
                          onChange={(e) =>
                            handleTicketChange(ticket.id, "description", e.target.value)
                          }
                        />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={ticket.is_free}
                                onChange={(e) =>
                                  handleTicketChange(ticket.id, "is_free", e.target.checked)
                                }
                                className="mr-2"
                              />
                              Free Ticket
                            </label>
                          </div>
                          {!ticket.is_free && (
                            <>
                              <InputWithFullBoarder
                                label="Price"
                                type="number"
                                value={ticket.price}
                                onChange={(e) =>
                                  handleTicketChange(ticket.id, "price", e.target.value)
                                }
                              />
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Currency
                                </label>
                                <select
                                  value={ticket.currency}
                                  onChange={(e) =>
                                    handleTicketChange(ticket.id, "currency", e.target.value)
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                                >
                                  {currencies.map((currency) => (
                                    <option key={currency.value} value={currency.value}>
                                      {currency.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <InputWithFullBoarder
                            label="Total Quantity"
                            type="number"
                            value={ticket.quantity}
                            onChange={(e) =>
                              handleTicketChange(ticket.id, "quantity", e.target.value)
                            }
                          />
                          <InputWithFullBoarder
                            label="Min Per Order"
                            type="number"
                            value={ticket.min_per_order}
                            onChange={(e) =>
                              handleTicketChange(ticket.id, "min_per_order", e.target.value)
                            }
                          />
                          <InputWithFullBoarder
                            label="Max Per Order"
                            type="number"
                            value={ticket.max_per_order}
                            onChange={(e) =>
                              handleTicketChange(ticket.id, "max_per_order", e.target.value)
                            }
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="grid grid-cols-2 gap-2">
                            <InputWithFullBoarder
                              label="Sale Start Date"
                              type="date"
                              value={ticket.sale_start_date}
                              onChange={(e) =>
                                handleTicketChange(ticket.id, "sale_start_date", e.target.value)
                              }
                            />
                            <InputWithFullBoarder
                              label="Sale Start Time"
                              type="time"
                              value={ticket.sale_start_time}
                              onChange={(e) =>
                                handleTicketChange(ticket.id, "sale_start_time", e.target.value)
                              }
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <InputWithFullBoarder
                              label="Sale End Date"
                              type="date"
                              value={ticket.sale_end_date}
                              onChange={(e) =>
                                handleTicketChange(ticket.id, "sale_end_date", e.target.value)
                              }
                            />
                            <InputWithFullBoarder
                              label="Sale End Time"
                              type="time"
                              value={ticket.sale_end_time}
                              onChange={(e) =>
                                handleTicketChange(ticket.id, "sale_end_time", e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={ticket.requires_approval}
                              onChange={(e) =>
                                handleTicketChange(ticket.id, "requires_approval", e.target.checked)
                              }
                              className="mr-2"
                            />
                            Requires Approval
                          </label>
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={ticket.visible_quantity}
                              onChange={(e) =>
                                handleTicketChange(ticket.id, "visible_quantity", e.target.checked)
                              }
                              className="mr-2"
                            />
                            Show Available Quantity
                          </label>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Ticket Button */}
              {!showAddTicket && (
                <button
                  onClick={() => setShowAddTicket(true)}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-purple-500 hover:text-purple-600 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Add Ticket Type
                </button>
              )}

              {/* Add Ticket Form */}
              {showAddTicket && (
                <div className="border-2 border-purple-200 rounded-lg p-6 bg-purple-50">
                  <h3 className="font-medium text-lg mb-4">Add New Ticket Type</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputWithFullBoarder
                        label="Ticket Name *"
                        value={newTicket.name}
                        onChange={(e) =>
                          setNewTicket({ ...newTicket, name: e.target.value })
                        }
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={newTicket.category}
                          onChange={(e) =>
                            setNewTicket({ ...newTicket, category: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        >
                          {ticketCategories.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <InputWithFullBoarder
                      label="Description"
                      isTextArea={true}
                      rows={2}
                      value={newTicket.description}
                      onChange={(e) =>
                        setNewTicket({ ...newTicket, description: e.target.value })
                      }
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={newTicket.is_free}
                            onChange={(e) =>
                              setNewTicket({ ...newTicket, is_free: e.target.checked })
                            }
                            className="mr-2"
                          />
                          Free Ticket
                        </label>
                      </div>
                      {!newTicket.is_free && (
                        <>
                          <InputWithFullBoarder
                            label="Price *"
                            type="number"
                            value={newTicket.price}
                            onChange={(e) =>
                              setNewTicket({ ...newTicket, price: e.target.value })
                            }
                          />
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Currency
                            </label>
                            <select
                              value={newTicket.currency}
                              onChange={(e) =>
                                setNewTicket({ ...newTicket, currency: e.target.value })
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                            >
                              {currencies.map((currency) => (
                                <option key={currency.value} value={currency.value}>
                                  {currency.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <InputWithFullBoarder
                        label="Total Quantity *"
                        type="number"
                        value={newTicket.quantity}
                        onChange={(e) =>
                          setNewTicket({ ...newTicket, quantity: e.target.value })
                        }
                      />
                      <InputWithFullBoarder
                        label="Min Per Order"
                        type="number"
                        value={newTicket.min_per_order}
                        onChange={(e) =>
                          setNewTicket({ ...newTicket, min_per_order: e.target.value })
                        }
                      />
                      <InputWithFullBoarder
                        label="Max Per Order"
                        type="number"
                        value={newTicket.max_per_order}
                        onChange={(e) =>
                          setNewTicket({ ...newTicket, max_per_order: e.target.value })
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid grid-cols-2 gap-2">
                        <InputWithFullBoarder
                          label="Sale Start Date"
                          type="date"
                          value={newTicket.sale_start_date}
                          onChange={(e) =>
                            setNewTicket({ ...newTicket, sale_start_date: e.target.value })
                          }
                        />
                        <InputWithFullBoarder
                          label="Sale Start Time"
                          type="time"
                          value={newTicket.sale_start_time}
                          onChange={(e) =>
                            setNewTicket({ ...newTicket, sale_start_time: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <InputWithFullBoarder
                          label="Sale End Date"
                          type="date"
                          value={newTicket.sale_end_date}
                          onChange={(e) =>
                            setNewTicket({ ...newTicket, sale_end_date: e.target.value })
                          }
                        />
                        <InputWithFullBoarder
                          label="Sale End Time"
                          type="time"
                          value={newTicket.sale_end_time}
                          onChange={(e) =>
                            setNewTicket({ ...newTicket, sale_end_time: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newTicket.requires_approval}
                          onChange={(e) =>
                            setNewTicket({ ...newTicket, requires_approval: e.target.checked })
                          }
                          className="mr-2"
                        />
                        Requires Approval
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newTicket.visible_quantity}
                          onChange={(e) =>
                            setNewTicket({ ...newTicket, visible_quantity: e.target.checked })
                          }
                          className="mr-2"
                        />
                        Show Available Quantity
                      </label>
                    </div>

                    <div className="flex gap-3">
                      <CustomButton
                        buttonText="Add Ticket"
                        onClick={handleAddTicket}
                        buttonColor="bg-purple-600"
                        radius="rounded-md"
                      />
                      <CustomButton
                        buttonText="Cancel"
                        onClick={() => setShowAddTicket(false)}
                        buttonColor="bg-gray-300"
                        textColor="text-gray-700"
                        radius="rounded-md"
                      />
                    </div>
                  </div>
                </div>
              )}

              {tickets.length === 0 && !showAddTicket && (
                <div className="text-center py-8 text-gray-500">
                  <Ticket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tickets created yet. Click "Add Ticket Type" to get started.</p>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4 bg-white">
                  <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    Payment Settings
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.ticketing_settings?.payment_required || false}
                        onChange={(e) =>
                          onFormDataChange("ticketing_settings", {
                            ...formData.ticketing_settings,
                            payment_required: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Payment Required at Checkout
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.ticketing_settings?.allow_refunds || false}
                        onChange={(e) =>
                          onFormDataChange("ticketing_settings", {
                            ...formData.ticketing_settings,
                            allow_refunds: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Allow Refunds
                    </label>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-white">
                  <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Access Settings
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.ticketing_settings?.require_login || false}
                        onChange={(e) =>
                          onFormDataChange("ticketing_settings", {
                            ...formData.ticketing_settings,
                            require_login: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Require Login to Purchase
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.ticketing_settings?.transfer_allowed || true}
                        onChange={(e) =>
                          onFormDataChange("ticketing_settings", {
                            ...formData.ticketing_settings,
                            transfer_allowed: e.target.checked,
                          })
                        }
                        className="mr-2"
                      />
                      Allow Ticket Transfers
                    </label>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-white">
                <h3 className="font-medium text-lg mb-4">General Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Service Fee (%)"
                    type="number"
                    value={formData.ticketing_settings?.service_fee || ""}
                    onChange={(e) =>
                      onFormDataChange("ticketing_settings", {
                        ...formData.ticketing_settings,
                        service_fee: e.target.value,
                      })
                    }
                  />
                  <InputWithFullBoarder
                    label="Max Tickets Per Customer"
                    type="number"
                    value={formData.ticketing_settings?.max_tickets_per_customer || ""}
                    onChange={(e) =>
                      onFormDataChange("ticketing_settings", {
                        ...formData.ticketing_settings,
                        max_tickets_per_customer: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {!ticketingEnabled && (
        <div className="text-center py-12 text-gray-500">
          <Ticket className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">Ticketing Disabled</h3>
          <p>Enable ticketing above to start creating tickets for your event.</p>
        </div>
      )}
    </div>
  );
};