"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Percent, 
  Tag, 
  Users, 
  Calendar,
  Eye,
  EyeOff,
  Copy,
  Download,
  DollarSign
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";

const CouponSystem = ({ eventId }) => {
  const [coupons, setCoupons] = useState([
    {
      id: "coupon_1",
      code: "EARLY20",
      name: "Early Bird Discount",
      description: "20% off for early registrations",
      type: "percentage",
      value: 20,
      min_purchase: 100,
      max_discount: 50,
      usage_limit: 100,
      used_count: 23,
      is_active: true,
      valid_from: "2024-07-01",
      valid_until: "2024-07-15",
      applicable_tickets: ["ticket_1", "ticket_2"],
      created_at: "2024-06-20T10:00:00"
    },
    {
      id: "coupon_2", 
      code: "VIP50",
      name: "VIP Exclusive",
      description: "$50 off VIP tickets",
      type: "fixed",
      value: 50,
      min_purchase: 200,
      max_discount: null,
      usage_limit: 50,
      used_count: 12,
      is_active: true,
      valid_from: "2024-07-01",
      valid_until: "2024-07-25",
      applicable_tickets: ["ticket_3"],
      created_at: "2024-06-25T14:30:00"
    },
    {
      id: "coupon_3",
      code: "BULK15",
      name: "Bulk Purchase Discount", 
      description: "15% off when buying 5+ tickets",
      type: "percentage",
      value: 15,
      min_purchase: null,
      min_quantity: 5,
      max_discount: 100,
      usage_limit: 200,
      used_count: 45,
      is_active: true,
      valid_from: "2024-07-01",
      valid_until: "2024-07-30",
      applicable_tickets: ["all"],
      created_at: "2024-06-15T09:15:00"
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    type: "percentage",
    value: "",
    min_purchase: "",
    min_quantity: "",
    max_discount: "",
    usage_limit: "",
    valid_from: "",
    valid_until: "",
    applicable_tickets: ["all"],
    is_active: true
  });

  const ticketOptions = [
    { id: "all", name: "All Tickets" },
    { id: "ticket_1", name: "General Admission" },
    { id: "ticket_2", name: "Premium" },
    { id: "ticket_3", name: "VIP" }
  ];

  const handleOpenModal = (coupon = null) => {
    setEditingCoupon(coupon);
    if (coupon) {
      setFormData({
        code: coupon.code || "",
        name: coupon.name || "",
        description: coupon.description || "",
        type: coupon.type || "percentage",
        value: coupon.value || "",
        min_purchase: coupon.min_purchase || "",
        min_quantity: coupon.min_quantity || "",
        max_discount: coupon.max_discount || "",
        usage_limit: coupon.usage_limit || "",
        valid_from: coupon.valid_from || "",
        valid_until: coupon.valid_until || "",
        applicable_tickets: coupon.applicable_tickets || ["all"],
        is_active: coupon.is_active !== undefined ? coupon.is_active : true
      });
    } else {
      setFormData({
        code: "",
        name: "",
        description: "",
        type: "percentage",
        value: "",
        min_purchase: "",
        min_quantity: "",
        max_discount: "",
        usage_limit: "",
        valid_from: "",
        valid_until: "",
        applicable_tickets: ["all"],
        is_active: true
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.code.trim() || !formData.name.trim() || !formData.value) {
      alert("Please fill in required fields");
      return;
    }

    const newCoupon = {
      id: editingCoupon?.id || `coupon_${Date.now()}`,
      ...formData,
      value: parseFloat(formData.value),
      min_purchase: formData.min_purchase ? parseFloat(formData.min_purchase) : null,
      min_quantity: formData.min_quantity ? parseInt(formData.min_quantity) : null,
      max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
      usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
      used_count: editingCoupon?.used_count || 0,
      created_at: editingCoupon?.created_at || new Date().toISOString()
    };

    if (editingCoupon) {
      setCoupons(prev => prev.map(c => c.id === editingCoupon.id ? newCoupon : c));
    } else {
      setCoupons(prev => [...prev, newCoupon]);
    }

    setShowModal(false);
    setEditingCoupon(null);
  };

  const handleDelete = (couponId) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      setCoupons(prev => prev.filter(c => c.id !== couponId));
    }
  };

  const toggleStatus = (couponId) => {
    setCoupons(prev => prev.map(c => 
      c.id === couponId ? { ...c, is_active: !c.is_active } : c
    ));
  };

  const copyCouponCode = (code) => {
    navigator.clipboard.writeText(code);
    alert("Coupon code copied to clipboard!");
  };

  const formatDiscount = (coupon) => {
    if (coupon.type === "percentage") {
      return `${coupon.value}%`;
    } else {
      return `$${coupon.value}`;
    }
  };

  const getUsagePercentage = (coupon) => {
    if (!coupon.usage_limit) return 0;
    return Math.round((coupon.used_count / coupon.usage_limit) * 100);
  };

  const isExpired = (validUntil) => {
    return new Date(validUntil) < new Date();
  };

  const totalCoupons = coupons.length;
  const activeCoupons = coupons.filter(c => c.is_active).length;
  const totalUsage = coupons.reduce((sum, c) => sum + c.used_count, 0);
  const totalSavings = coupons.reduce((sum, c) => {
    const avgDiscount = c.type === "percentage" ? c.value : c.value;
    return sum + (c.used_count * avgDiscount);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Coupon Management</h2>
          <p className="text-gray-600">
            Create and manage discount coupons for your event tickets
          </p>
        </div>
        <CustomButton
          buttonText="Create Coupon"
          prefixIcon={<Plus className="w-4 h-4" />}
          buttonColor="bg-purple-600"
          radius="rounded-md"
          onClick={() => handleOpenModal()}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Coupons</p>
              <p className="text-2xl font-semibold">{totalCoupons}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Active Coupons</p>
              <p className="text-2xl font-semibold">{activeCoupons}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Total Usage</p>
              <p className="text-2xl font-semibold">{totalUsage}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Total Savings</p>
              <p className="text-2xl font-semibold">${totalSavings.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Coupons List */}
      <div className="space-y-4">
        {coupons.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Tag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons yet</h3>
            <p className="text-gray-500 mb-4">
              Create discount coupons to boost ticket sales
            </p>
            <CustomButton
              buttonText="Create First Coupon"
              prefixIcon={<Plus className="w-4 h-4" />}
              buttonColor="bg-purple-600"
              radius="rounded-md"
              onClick={() => handleOpenModal()}
            />
          </div>
        ) : (
          coupons.map(coupon => (
            <div key={coupon.id} className="bg-white border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{coupon.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        {coupon.code}
                      </span>
                      <button
                        onClick={() => copyCouponCode(coupon.code)}
                        className="p-1 text-gray-500 hover:text-purple-600"
                        title="Copy code"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    {isExpired(coupon.valid_until) && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
                        Expired
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">{coupon.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Discount:</span>
                      <p className="font-semibold text-purple-600">{formatDiscount(coupon)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Usage:</span>
                      <p className="font-semibold">
                        {coupon.used_count}/{coupon.usage_limit || "∞"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Valid Until:</span>
                      <p className="font-semibold">
                        {new Date(coupon.valid_until).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Min Purchase:</span>
                      <p className="font-semibold">
                        {coupon.min_purchase ? `$${coupon.min_purchase}` : "None"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <p className={`font-semibold ${
                        coupon.is_active ? "text-green-600" : "text-red-600"
                      }`}>
                        {coupon.is_active ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>

                  {coupon.usage_limit && (
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Usage Progress</span>
                        <span>{getUsagePercentage(coupon)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${getUsagePercentage(coupon)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleStatus(coupon.id)}
                    className={`p-2 rounded ${
                      coupon.is_active 
                        ? 'text-green-600 bg-green-50' 
                        : 'text-gray-400 bg-gray-50'
                    }`}
                    title={coupon.is_active ? "Active" : "Inactive"}
                  >
                    {coupon.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleOpenModal(coupon)}
                    className="p-2 text-gray-500 hover:text-blue-600 rounded"
                    title="Edit coupon"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(coupon.id)}
                    className="p-2 text-gray-500 hover:text-red-600 rounded"
                    title="Delete coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Coupon Code *"
                    placeholder="e.g., SAVE20"
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  />
                  <InputWithFullBoarder
                    label="Coupon Name *"
                    placeholder="e.g., Early Bird Discount"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <InputWithFullBoarder
                  label="Description"
                  placeholder="Brief description of the coupon"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount ($)</option>
                    </select>
                  </div>
                  <InputWithFullBoarder
                    label={`Discount Value * (${formData.type === 'percentage' ? '%' : '$'})`}
                    type="number"
                    placeholder={formData.type === 'percentage' ? '20' : '50'}
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputWithFullBoarder
                    label="Min Purchase Amount"
                    type="number"
                    placeholder="100"
                    value={formData.min_purchase}
                    onChange={(e) => setFormData({...formData, min_purchase: e.target.value})}
                  />
                  <InputWithFullBoarder
                    label="Min Quantity"
                    type="number"
                    placeholder="1"
                    value={formData.min_quantity}
                    onChange={(e) => setFormData({...formData, min_quantity: e.target.value})}
                  />
                  {formData.type === 'percentage' && (
                    <InputWithFullBoarder
                      label="Max Discount ($)"
                      type="number"
                      placeholder="50"
                      value={formData.max_discount}
                      onChange={(e) => setFormData({...formData, max_discount: e.target.value})}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputWithFullBoarder
                    label="Usage Limit"
                    type="number"
                    placeholder="100"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({...formData, usage_limit: e.target.value})}
                  />
                  <InputWithFullBoarder
                    label="Valid From"
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) => setFormData({...formData, valid_from: e.target.value})}
                  />
                  <InputWithFullBoarder
                    label="Valid Until"
                    type="date"
                    value={formData.valid_until}
                    onChange={(e) => setFormData({...formData, valid_until: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Applicable Tickets
                  </label>
                  <div className="space-y-2">
                    {ticketOptions.map(ticket => (
                      <label key={ticket.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.applicable_tickets.includes(ticket.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                applicable_tickets: [...formData.applicable_tickets, ticket.id]
                              });
                            } else {
                              setFormData({
                                ...formData,
                                applicable_tickets: formData.applicable_tickets.filter(id => id !== ticket.id)
                              });
                            }
                          }}
                          className="mr-2"
                        />
                        {ticket.name}
                      </label>
                    ))}
                  </div>
                </div>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="mr-2"
                  />
                  Active Coupon
                </label>

                <div className="flex gap-3 pt-4">
                  <CustomButton
                    buttonText={editingCoupon ? "Update Coupon" : "Create Coupon"}
                    buttonColor="bg-purple-600"
                    radius="rounded-md"
                    onClick={handleSave}
                  />
                  <CustomButton
                    buttonText="Cancel"
                    buttonColor="bg-gray-300"
                    textColor="text-gray-700"
                    radius="rounded-md"
                    onClick={() => setShowModal(false)}
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

export default CouponSystem;