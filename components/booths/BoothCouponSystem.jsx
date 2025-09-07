"use client";

import React, { useState, useEffect } from "react";
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
  DollarSign,
} from "lucide-react";
import CustomButton from "@/components/Button";
import InputWithFullBoarder from "@/components/InputWithFullBoarder";
import {
  CreateBoothCouponManager,
  useGetEventBoothCouponsManager,
  UpdateBoothCouponManager,
  DeleteBoothCouponManager,
} from "@/app/booths/controllers/boothCouponController";
import { useGetEventBoothsManager } from "@/app/booths/controllers/boothController";
import Loader from "@/components/Loader";
import { toast } from "react-toastify";

const BoothCouponSystem = ({ eventId }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    type: "percentage",
    value: "",
    min_purchase: "",
    max_discount: "",
    usage_limit: "",
    valid_from: "",
    valid_until: "",
    applicable_booths: [],
    apply_to_all_booths: false,
    is_active: true,
  });

  // API integrations
  const {
    data: couponsData,
    isLoading: loadingCoupons,
    refetch: refetchCoupons,
  } = useGetEventBoothCouponsManager(eventId);
  const { data: boothsData } = useGetEventBoothsManager(eventId);
  const { createCoupon, isLoading: creating } = CreateBoothCouponManager();
  const { updateCoupon, isLoading: updating } = UpdateBoothCouponManager({
    couponId: editingCoupon?._id,
  });
  const { deleteCoupon, isLoading: deleting } = DeleteBoothCouponManager({
    couponId: editingCoupon?._id,
  });

  const isLoading = creating || updating || deleting;

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      type: "percentage",
      value: "",
      min_purchase: "",
      max_discount: "",
      usage_limit: "",
      valid_from: "",
      valid_until: "",
      applicable_booths: [],
      apply_to_all_booths: false,
      is_active: true,
    });
  };

  const handleSaveCoupon = async () => {
    try {
      if (!formData.code || !formData.name || !formData.value) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (!formData.valid_from || !formData.valid_until) {
        toast.error("Please set validity dates");
        return;
      }

      if (new Date(formData.valid_until) <= new Date(formData.valid_from)) {
        toast.error("End date must be after start date");
        return;
      }

      const couponData = {
        event: eventId,
        code: formData.code.toUpperCase(),
        name: formData.name,
        description: formData.description,
        type: formData.type,
        value: parseFloat(formData.value),
        min_purchase: formData.min_purchase
          ? parseFloat(formData.min_purchase)
          : undefined,
        max_discount: formData.max_discount
          ? parseFloat(formData.max_discount)
          : undefined,
        usage_limit: formData.usage_limit
          ? parseInt(formData.usage_limit)
          : undefined,
        valid_from: formData.valid_from,
        valid_until: formData.valid_until,
        applicable_booths: formData.apply_to_all_booths
          ? []
          : formData.applicable_booths,
        apply_to_all_booths: formData.apply_to_all_booths,
        is_active: formData.is_active,
      };

      if (editingCoupon) {
        await updateCoupon(couponData);
      } else {
        await createCoupon(couponData);
      }

      await refetchCoupons();
      setShowModal(false);
      setEditingCoupon(null);
      resetForm();
    } catch (error) {
      console.error("Error saving coupon:", error);
    }
  };

  const handleDeleteCoupon = async () => {
    try {
      await deleteCoupon();
      await refetchCoupons();
      document.getElementById("delete-coupon").close();
    } catch (error) {
      console.error("Error deleting coupon:", error);
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || "",
      type: coupon.type,
      value: coupon.value.toString(),
      min_purchase: coupon.min_purchase?.toString() || "",
      max_discount: coupon.max_discount?.toString() || "",
      usage_limit: coupon.usage_limit?.toString() || "",
      valid_from: coupon.valid_from?.split("T")[0] || "",
      valid_until: coupon.valid_until?.split("T")[0] || "",
      applicable_booths: coupon.applicable_booths || [],
      apply_to_all_booths: coupon.apply_to_all_booths || false,
      is_active: coupon.is_active,
    });
    setShowModal(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Coupon code copied to clipboard!");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loadingCoupons) {
    return <Loader />;
  }

  const coupons = couponsData?.data?.coupons || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Booth Coupons</h2>
          <p className="text-sm text-gray-600">
            Manage discount coupons for booth sales
          </p>
        </div>
        <CustomButton
          buttonText="Create Coupon"
          prefixIcon={<Plus size={16} />}
          radius="rounded-md"
          onClick={() => {
            setEditingCoupon(null);
            resetForm();
            setShowModal(true);
          }}
        />
      </div>

      {/* Coupons Grid */}
      {coupons.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <Percent className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No coupons yet
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first coupon to offer discounts on booth sales.
          </p>
          <CustomButton
            buttonText="Create First Coupon"
            prefixIcon={<Plus size={16} />}
            radius="rounded-md"
            onClick={() => {
              setEditingCoupon(null);
              resetForm();
              setShowModal(true);
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div key={coupon._id} className="bg-white border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-olive/10 rounded-lg flex items-center justify-center">
                    <Tag className="w-5 h-5 text-olive" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {coupon.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm font-mono">
                        {coupon.code}
                      </code>
                      <button
                        onClick={() => copyToClipboard(coupon.code)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Copy code"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded ${
                    coupon.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {coupon.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {coupon.description && (
                <p className="text-sm text-gray-600 mb-4">
                  {coupon.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount:</span>
                  <span className="font-medium">
                    {coupon.type === "percentage"
                      ? `${coupon.value}%`
                      : formatCurrency(coupon.value)}
                  </span>
                </div>

                {coupon.min_purchase && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Min Purchase:</span>
                    <span>{formatCurrency(coupon.min_purchase)}</span>
                  </div>
                )}

                {coupon.usage_limit && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Usage:</span>
                    <span>
                      {coupon.usage_count || 0} / {coupon.usage_limit}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Valid:</span>
                  <span>
                    {formatDate(coupon.valid_from)} -{" "}
                    {formatDate(coupon.valid_until)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Applies to:</span>
                  <span>
                    {coupon.apply_to_all_booths
                      ? "All booths"
                      : `${coupon.applicable_booths?.length || 0} booth(s)`}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(coupon)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setEditingCoupon(coupon);
                    document.getElementById("delete-coupon").showModal();
                  }}
                  className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 !mt-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingCoupon(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Coupon Code *"
                    placeholder="e.g., BOOTH20"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                  />
                  <InputWithFullBoarder
                    label="Coupon Name *"
                    placeholder="e.g., 20% Off Booths"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <InputWithFullBoarder
                  label="Description"
                  placeholder="Brief description of the coupon"
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
                      Discount Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-olive focus:border-olive"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>
                  <InputWithFullBoarder
                    label={`Discount Value * ${
                      formData.type === "percentage" ? "(%)" : "($)"
                    }`}
                    type="number"
                    step={formData.type === "percentage" ? "1" : "0.01"}
                    placeholder={
                      formData.type === "percentage" ? "20" : "50.00"
                    }
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputWithFullBoarder
                    label="Minimum Purchase ($)"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.min_purchase}
                    onChange={(e) =>
                      setFormData({ ...formData, min_purchase: e.target.value })
                    }
                  />
                  {formData.type === "percentage" && (
                    <InputWithFullBoarder
                      label="Maximum Discount ($)"
                      type="number"
                      step="0.01"
                      placeholder="100.00"
                      value={formData.max_discount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          max_discount: e.target.value,
                        })
                      }
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputWithFullBoarder
                    label="Usage Limit"
                    type="number"
                    placeholder="Unlimited"
                    value={formData.usage_limit}
                    onChange={(e) =>
                      setFormData({ ...formData, usage_limit: e.target.value })
                    }
                  />
                  <InputWithFullBoarder
                    label="Valid From *"
                    type="date"
                    value={formData.valid_from}
                    onChange={(e) =>
                      setFormData({ ...formData, valid_from: e.target.value })
                    }
                  />
                  <InputWithFullBoarder
                    label="Valid Until *"
                    type="date"
                    min={formData.valid_from && new Date(formData.valid_from).toISOString().split('T')[0]}
                    value={formData.valid_until}
                    onChange={(e) =>
                      setFormData({ ...formData, valid_until: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.apply_to_all_booths}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          apply_to_all_booths: e.target.checked,
                          applicable_booths: e.target.checked
                            ? []
                            : formData.applicable_booths,
                        })
                      }
                      className="mr-2"
                    />
                    Apply to all booths
                  </label>

                  {!formData.apply_to_all_booths && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Applicable Booths
                      </label>
                      <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                        {boothsData?.data?.map((booth) => (
                          <label
                            key={booth._id}
                            className="flex items-center py-1"
                          >
                            <input
                              type="checkbox"
                              checked={formData.applicable_booths.includes(
                                booth._id
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFormData({
                                    ...formData,
                                    applicable_booths: [
                                      ...formData.applicable_booths,
                                      booth._id,
                                    ],
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    applicable_booths:
                                      formData.applicable_booths.filter(
                                        (id) => id !== booth._id
                                      ),
                                  });
                                }
                              }}
                              className="mr-2"
                            />
                            <span className="text-sm">{booth.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_active: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    Active (available for use)
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <CustomButton
                    buttonText={
                      editingCoupon ? "Update Coupon" : "Create Coupon"
                    }
                    radius="rounded-md"
                    isLoading={isLoading}
                    onClick={handleSaveCoupon}
                  />
                  <CustomButton
                    buttonText="Cancel"
                    onClick={() => {
                      setShowModal(false);
                      setEditingCoupon(null);
                      resetForm();
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

      {/* Delete Confirmation Modal */}
      <dialog id="delete-coupon" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete Coupon</h3>
          <p className="py-4">
            Are you sure you want to delete the coupon "{editingCoupon?.name}"?
            This action cannot be undone.
          </p>
          <div className="modal-action">
            <CustomButton
              buttonText="Delete"
              buttonColor="bg-red-600"
              textColor="text-white"
              radius="rounded-md"
              isLoading={deleting}
              onClick={handleDeleteCoupon}
            />
            <form method="dialog">
              <CustomButton
                buttonText="Cancel"
                buttonColor="bg-gray-300"
                textColor="text-gray-700"
                radius="rounded-md"
              />
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default BoothCouponSystem;
