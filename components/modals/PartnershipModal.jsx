"use client";

import React, { useState } from "react";
import { X, Users, Percent, Gift } from "lucide-react";
import Button from "@/components/Button";
import useGetPartnerDiscountsManager from "@/app/admin/settings/controllers/getPartnerDiscountsController";
import Loader from "@/components/Loader";

const PartnershipModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading = false, 
  userName = "",
  type = "make" // "make" or "remove"
}) => {
  const [selectedDiscountId, setSelectedDiscountId] = useState("");
  const { data: discounts, isLoading: loadingDiscounts } = useGetPartnerDiscountsManager();

  const partnerDiscounts = discounts?.data?.data || [];

  const handleConfirm = () => {
    if (type === "make" && !selectedDiscountId) {
      return; // Don't proceed if no discount selected
    }
    onConfirm(selectedDiscountId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className={type === "make" ? "text-green-600" : "text-red-600"} size={24} />
              <h3 className="text-xl font-semibold text-gray-900">
                {type === "make" ? "Make Partner" : "Remove Partner"}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              {type === "make" 
                ? `Are you sure you want to make ${userName} a partner? Please select the discount tier they should receive.`
                : `Are you sure you want to remove partner status from ${userName}? This will revoke their partner benefits.`
              }
            </p>

            {/* Discount Selection for Make Partner */}
            {type === "make" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Partner Discount Tier *
                </label>
                
                {loadingDiscounts ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader />
                  </div>
                ) : partnerDiscounts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Gift className="mx-auto mb-2" size={32} />
                    <p className="text-sm">No partner discounts available</p>
                    <p className="text-xs">Create partner discounts in Settings first</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {partnerDiscounts.map((discount) => (
                      <label
                        key={discount._id}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedDiscountId === discount._id
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="discount"
                          value={discount._id}
                          checked={selectedDiscountId === discount._id}
                          onChange={(e) => setSelectedDiscountId(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 border-2 rounded-full ${
                              selectedDiscountId === discount._id
                                ? "border-green-500 bg-green-500"
                                : "border-gray-300"
                            }`}>
                              {selectedDiscountId === discount._id && (
                                <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {discount.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {discount.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-green-600">
                            <Percent size={16} />
                            <span className="font-semibold">{discount.value}% OFF</span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Warning for Remove Partner */}
            {type === "remove" && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 text-red-600 mt-0.5">⚠️</div>
                  <div>
                    <h4 className="font-medium text-red-900 mb-1">Warning</h4>
                    <p className="text-sm text-red-800">
                      Removing partner status will immediately revoke all partner benefits 
                      and discounts. This action can be reversed by making them a partner again.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              buttonText="Cancel"
              onClick={onClose}
              buttonColor="bg-gray-200"
              textColor="text-gray-700"
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              buttonText={
                isLoading 
                  ? (type === "make" ? "Making Partner..." : "Removing...")
                  : (type === "make" ? "Make Partner" : "Remove Partner")
              }
              onClick={handleConfirm}
              buttonColor={type === "make" ? "bg-green-600" : "bg-red-600"}
              textColor="text-white"
              className="flex-1"
              isLoading={isLoading}
              disabled={
                isLoading || 
                (type === "make" && (!selectedDiscountId || partnerDiscounts.length === 0))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnershipModal;