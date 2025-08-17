import React, { useEffect, useState } from "react";
import CustomButton from "../Button";
import InputWithFullBoarder from "../InputWithFullBoarder";
import Loader from "../Loader";
import useGetPricingsManager from "@/app/admin/settings/controllers/getPricingController";
import useGetDiscountsManager from "@/app/admin/settings/controllers/getDiscountsController";
import { Pencil, Trash2, X } from "lucide-react";
import { CreateDiscountsManager } from "@/app/admin/settings/controllers/createDiscountsController";
import { CreatePricingManager } from "@/app/admin/settings/controllers/createPricingController";
import { DeleteDiscountManager } from "@/app/admin/settings/controllers/deleteDiscountController";
import { UpdateDiscountManager } from "@/app/admin/settings/controllers/updateDiscountController";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import { useGetCreditPricingManager } from "@/app/events/controllers/creditManagement/getCreditPricingController";
import { UpdateCreditPricingManager } from "@/app/events/controllers/creditManagement/updateCreditPricingController";
import { CreateCreditPricingManager } from "@/app/events/controllers/creditManagement/createCreditPricingController";
import useGetPartnerDiscountsManager from "@/app/admin/settings/controllers/getPartnerDiscountsController";
import { CreatePartnerDiscountManager } from "@/app/admin/settings/controllers/createPartnerDiscountController";
import { UpdatePartnerDiscountManager } from "@/app/admin/settings/controllers/updatePartnerDiscountController";
import { DeletePartnerDiscountManager } from "@/app/admin/settings/controllers/deletePartnerDiscountController";

const ConfigurationSection = () => {
  const { data, isLoading } = useGetPricingsManager();
  const { data: creditPricingData, isLoading: loadingCreditPricing, error: creditPricingError } = useGetCreditPricingManager();
  const { updateCreditPricing, isLoading: updatingCreditPricing } = UpdateCreditPricingManager();
  const { createCreditPricing, isLoading: creatingCreditPricing } = CreateCreditPricingManager();
  const [discountId, setDiscountId] = useState();
  const { createPricing, isLoading: updating } = CreatePricingManager();
  const { data: discounts, isLoading: loadingDiscounts } =
    useGetDiscountsManager();
  const { data: partnerDiscounts, isLoading: loadingPartnerDiscounts } =
    useGetPartnerDiscountsManager();
  const { createDiscount, isLoading: addingDiscounts } =
    CreateDiscountsManager();
  const { updateDiscounts, isLoading: updatingDiscount } =
    UpdateDiscountManager({ discountId: discountId });
  const {
    deleteDiscount,
    isLoading: deletingDiscount,
    isSuccess,
  } = DeleteDiscountManager({ discountId: discountId });

  // Partner discount controllers
  const { createPartnerDiscount, isLoading: addingPartnerDiscounts } =
    CreatePartnerDiscountManager();
  const { updatePartnerDiscount, isLoading: updatingPartnerDiscount } =
    UpdatePartnerDiscountManager({ discountId: discountId });
  const {
    deletePartnerDiscount,
    isLoading: deletingPartnerDiscount,
    isSuccess: partnerDiscountDeleted,
  } = DeletePartnerDiscountManager({ discountId: discountId });

  const [formData, setFormData] = useState({
    event_price_naira: 0,
    event_price_usd: 0,
  });

  const [creditFormData, setCreditFormData] = useState({
    invitation_email_price_naira: 0,
    invitation_email_price_usd: 0,
    invitation_sms_price_naira: 0,
    invitation_sms_price_usd: 0,
    invitation_whatsapp_price_naira: 0,
    invitation_whatsapp_price_usd: 0,
    invitation_voice_price_naira: 0,
    invitation_voice_price_usd: 0,
    notification_email_price_naira: 0,
    notification_email_price_usd: 0,
    notification_sms_price_naira: 0,
    notification_sms_price_usd: 0,
    notification_whatsapp_price_naira: 0,
    notification_whatsapp_price_usd: 0,
    notification_voice_price_naira: 0,
    notification_voice_price_usd: 0,
  });

  const [discountArray, setDiscountArray] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newDiscount, setNewDiscount] = useState({
    no_of_invites: "",
    percent: "",
    type: "default",
  });

  // Partner discount state
  const [partnerDiscountArray, setPartnerDiscountArray] = useState([]);
  const [editingPartnerId, setEditingPartnerId] = useState(null);
  const [newPartnerDiscount, setNewPartnerDiscount] = useState({
    name: "",
    description: "",
    type: "percentage",
    value: "",
    min_purchase: "",
    max_discount: "",
    is_active: true,
  });

  useEffect(() => {
    if (isSuccess) {
      document.getElementById("delete").closest();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (data?.data) {
      setFormData({
        event_price_naira: Number(data.data.event_price_naira) || 0,
        event_price_usd: Number(data.data.event_price_usd) || 0,
      });
    }
  }, [data]);

  useEffect(() => {
    if (creditPricingData?.data) {
      setCreditFormData({
        invitation_email_price_naira: Number(creditPricingData.data.invitation_email_price_naira) || 0,
        invitation_email_price_usd: Number(creditPricingData.data.invitation_email_price_usd) || 0,
        invitation_sms_price_naira: Number(creditPricingData.data.invitation_sms_price_naira) || 0,
        invitation_sms_price_usd: Number(creditPricingData.data.invitation_sms_price_usd) || 0,
        invitation_whatsapp_price_naira: Number(creditPricingData.data.invitation_whatsapp_price_naira) || 0,
        invitation_whatsapp_price_usd: Number(creditPricingData.data.invitation_whatsapp_price_usd) || 0,
        invitation_voice_price_naira: Number(creditPricingData.data.invitation_voice_price_naira) || 0,
        invitation_voice_price_usd: Number(creditPricingData.data.invitation_voice_price_usd) || 0,
        notification_email_price_naira: Number(creditPricingData.data.notification_email_price_naira) || 0,
        notification_email_price_usd: Number(creditPricingData.data.notification_email_price_usd) || 0,
        notification_sms_price_naira: Number(creditPricingData.data.notification_sms_price_naira) || 0,
        notification_sms_price_usd: Number(creditPricingData.data.notification_sms_price_usd) || 0,
        notification_whatsapp_price_naira: Number(creditPricingData.data.notification_whatsapp_price_naira) || 0,
        notification_whatsapp_price_usd: Number(creditPricingData.data.notification_whatsapp_price_usd) || 0,
        notification_voice_price_naira: Number(creditPricingData.data.notification_voice_price_naira) || 0,
        notification_voice_price_usd: Number(creditPricingData.data.notification_voice_price_usd) || 0,
      });
    }
  }, [creditPricingData]);

  useEffect(() => {
    if (discounts?.data) {
      const formattedDiscounts = discounts.data.map((discount) => ({
        ...discount,
        no_of_invites: Number(discount.no_of_invites) || 0,
        percent: Number(discount.percent) || 0,
      }));
      setDiscountArray(formattedDiscounts);
    }
  }, [discounts]);

  useEffect(() => {
    if (partnerDiscounts?.data?.data) {
      const formattedPartnerDiscounts = partnerDiscounts.data.data.map((discount) => ({
        ...discount,
        value: Number(discount.value) || 0,
        min_purchase: Number(discount.min_purchase) || 0,
        max_discount: Number(discount.max_discount) || 0,
      }));
      setPartnerDiscountArray(formattedPartnerDiscounts);
    }
  }, [partnerDiscounts]);

  const handleSavePricingChanges = () => {
    const updatedFormData = {
      event_price_naira: Number(formData.event_price_naira) || 0,
      event_price_usd: Number(formData.event_price_usd) || 0,
      price_per_invite_naira: 0,
      price_per_invite_usd: 0,
    };
    createPricing(updatedFormData);
  };

  const handleSaveCreditPricingChanges = () => {
    const updatedCreditData = {
      invitation_email_price_naira: Number(creditFormData.invitation_email_price_naira) || 0,
      invitation_email_price_usd: Number(creditFormData.invitation_email_price_usd) || 0,
      invitation_sms_price_naira: Number(creditFormData.invitation_sms_price_naira) || 0,
      invitation_sms_price_usd: Number(creditFormData.invitation_sms_price_usd) || 0,
      invitation_whatsapp_price_naira: Number(creditFormData.invitation_whatsapp_price_naira) || 0,
      invitation_whatsapp_price_usd: Number(creditFormData.invitation_whatsapp_price_usd) || 0,
      invitation_voice_price_naira: Number(creditFormData.invitation_voice_price_naira) || 0,
      invitation_voice_price_usd: Number(creditFormData.invitation_voice_price_usd) || 0,
      notification_email_price_naira: Number(creditFormData.notification_email_price_naira) || 0,
      notification_email_price_usd: Number(creditFormData.notification_email_price_usd) || 0,
      notification_sms_price_naira: Number(creditFormData.notification_sms_price_naira) || 0,
      notification_sms_price_usd: Number(creditFormData.notification_sms_price_usd) || 0,
      notification_whatsapp_price_naira: Number(creditFormData.notification_whatsapp_price_naira) || 0,
      notification_whatsapp_price_usd: Number(creditFormData.notification_whatsapp_price_usd) || 0,
      notification_voice_price_naira: Number(creditFormData.notification_voice_price_naira) || 0,
      notification_voice_price_usd: Number(creditFormData.notification_voice_price_usd) || 0,
    };
    
    // Check if credit pricing exists - if error indicates not found, create; otherwise update
    if (creditPricingError && creditPricingError.message && creditPricingError.message.includes("not found")) {
      createCreditPricing(updatedCreditData);
    } else {
      updateCreditPricing(updatedCreditData);
    }
  };

  const handleDiscountChange = (index, field, value) => {
    setDiscountArray((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === "type" ? value : Number(value) || 0,
      };
      return updated;
    });
  };

  const handleAddDiscount = () => {
    if (!newDiscount.no_of_invites || !newDiscount.percent) return;

    const discountToAdd = {
      type: newDiscount.type,
      no_of_invites: Number(newDiscount.no_of_invites) || 0,
      percent: Number(newDiscount.percent) || 0,
    };

    createDiscount(discountToAdd);
    setNewDiscount({
      no_of_invites: "",
      percent: "",
      type: "default",
    });
  };

  const handleEditDiscount = (discount) => {
    const updatedDiscount = {
      ...discount,
      no_of_invites: Number(discount.no_of_invites) || 0,
      percent: Number(discount.percent) || 0,
    };
    updateDiscounts(updatedDiscount);
    setEditingId(null);
  };

  const handleDeleteDiscount = async () => {
    await deleteDiscount();
  };

  // Partner discount handlers
  const handlePartnerDiscountChange = (index, field, value) => {
    setPartnerDiscountArray((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === "type" || field === "name" || field === "description" ? value : Number(value) || 0,
      };
      return updated;
    });
  };

  const handleAddPartnerDiscount = () => {
    if (!newPartnerDiscount.name || !newPartnerDiscount.value) return;

    const discountToAdd = {
      name: newPartnerDiscount.name,
      description: newPartnerDiscount.description,
      type: newPartnerDiscount.type,
      value: Number(newPartnerDiscount.value) || 0,
      min_purchase: Number(newPartnerDiscount.min_purchase) || 0,
      max_discount: Number(newPartnerDiscount.max_discount) || 0,
      is_active: newPartnerDiscount.is_active,
    };

    createPartnerDiscount(discountToAdd);
    setNewPartnerDiscount({
      name: "",
      description: "",
      type: "percentage",
      value: "",
      min_purchase: "",
      max_discount: "",
      is_active: true,
    });
  };

  const handleEditPartnerDiscount = (discount) => {
    const updatedDiscount = {
      ...discount,
      value: Number(discount.value) || 0,
      min_purchase: Number(discount.min_purchase) || 0,
      max_discount: Number(discount.max_discount) || 0,
    };
    updatePartnerDiscount(updatedDiscount);
    setEditingPartnerId(null);
  };

  const handleDeletePartnerDiscount = async () => {
    await deletePartnerDiscount();
  };

  if (isLoading || loadingDiscounts || loadingPartnerDiscounts || loadingCreditPricing || creatingCreditPricing) return <Loader />;

  return (
    <div className="flex w-full bg-white rounded-lg flex-col text-brandBlack p-10">
      {/* Pricing Section */}
      <div className="flex items-start gap-32">
        <div className="flex flex-col items-start">
          <p className="text-16px font-semibold">Event Pricing</p>
          <p className="text-14px text-textGrey2 w-[200px] mb-10">
            Set and configure event pricing
          </p>
          <CustomButton
            buttonText="Save Changes"
            isLoading={updating}
            onClick={handleSavePricingChanges}
          />
        </div>
        <div className="relative w-[546px] flex flex-col">
          <div className="w-full">
            <InputWithFullBoarder
              label="Price per event (USD)"
              placeholder="$ 0.00"
              type="number"
              step="0.01"
              min="0"
              value={formData.event_price_usd}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  event_price_usd: e.target.value,
                })
              }
            />
            <InputWithFullBoarder
              label="Price per event (NGN)"
              placeholder="NGN 0.00"
              type="number"
              step="0.01"
              min="0"
              value={formData.event_price_naira}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  event_price_naira: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>

      <div className="divider my-10"></div>

      {/* Credit Pricing Section */}
      <div className="flex items-start gap-32 mb-10">
        <div className="flex flex-col items-start">
          <p className="text-16px font-semibold">Credit Pricing</p>
          <p className="text-14px text-textGrey2 w-[200px] mb-10">
            Set pricing for invitation and notification credits
          </p>
          <CustomButton
            buttonText="Save Credit Pricing"
            isLoading={updatingCreditPricing || creatingCreditPricing}
            onClick={handleSaveCreditPricingChanges}
          />
        </div>
        <div className="relative w-[546px] flex flex-col space-y-6">
          {/* Invitation Credits */}
          <div>
            <h4 className="font-semibold mb-4">Invitation Credits</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Email</p>
                <InputWithFullBoarder
                  label="Naira (₦)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={creditFormData.invitation_email_price_naira}
                  onChange={(e) =>
                    setCreditFormData({
                      ...creditFormData,
                      invitation_email_price_naira: e.target.value,
                    })
                  }
                />
                <InputWithFullBoarder
                  label="USD ($)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={creditFormData.invitation_email_price_usd}
                  onChange={(e) =>
                    setCreditFormData({
                      ...creditFormData,
                      invitation_email_price_usd: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">SMS</p>
                <InputWithFullBoarder
                  label="Naira (₦)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={creditFormData.invitation_sms_price_naira}
                  onChange={(e) =>
                    setCreditFormData({
                      ...creditFormData,
                      invitation_sms_price_naira: e.target.value,
                    })
                  }
                />
                <InputWithFullBoarder
                  label="USD ($)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={creditFormData.invitation_sms_price_usd}
                  onChange={(e) =>
                    setCreditFormData({
                      ...creditFormData,
                      invitation_sms_price_usd: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">WhatsApp</p>
                <InputWithFullBoarder
                  label="Naira (₦)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={creditFormData.invitation_whatsapp_price_naira}
                  onChange={(e) =>
                    setCreditFormData({
                      ...creditFormData,
                      invitation_whatsapp_price_naira: e.target.value,
                    })
                  }
                />
                <InputWithFullBoarder
                  label="USD ($)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={creditFormData.invitation_whatsapp_price_usd}
                  onChange={(e) =>
                    setCreditFormData({
                      ...creditFormData,
                      invitation_whatsapp_price_usd: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Voice</p>
                <InputWithFullBoarder
                  label="Naira (₦)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={creditFormData.invitation_voice_price_naira}
                  onChange={(e) =>
                    setCreditFormData({
                      ...creditFormData,
                      invitation_voice_price_naira: e.target.value,
                    })
                  }
                />
                <InputWithFullBoarder
                  label="USD ($)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={creditFormData.invitation_voice_price_usd}
                  onChange={(e) =>
                    setCreditFormData({
                      ...creditFormData,
                      invitation_voice_price_usd: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Notification Credits */}
          <div>
            <h4 className="font-semibold mb-4">Notification Credits</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Email</p>
                <InputWithFullBoarder
                  label="Naira (₦)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={creditFormData.notification_email_price_naira}
                  onChange={(e) =>
                    setCreditFormData({
                      ...creditFormData,
                      notification_email_price_naira: e.target.value,
                    })
                  }
                />
                <InputWithFullBoarder
                  label="USD ($)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={creditFormData.notification_email_price_usd}
                  onChange={(e) =>
                    setCreditFormData({
                      ...creditFormData,
                      notification_email_price_usd: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">SMS</p>
                <InputWithFullBoarder
                  label="Naira (₦)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={creditFormData.notification_sms_price_naira}
                  onChange={(e) =>
                    setCreditFormData({
                      ...creditFormData,
                      notification_sms_price_naira: e.target.value,
                    })
                  }
                />
                <InputWithFullBoarder
                  label="USD ($)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={creditFormData.notification_sms_price_usd}
                  onChange={(e) =>
                    setCreditFormData({
                      ...creditFormData,
                      notification_sms_price_usd: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">WhatsApp</p>
                <InputWithFullBoarder
                  label="Naira (₦)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={creditFormData.notification_whatsapp_price_naira}
                  onChange={(e) =>
                    setCreditFormData({
                      ...creditFormData,
                      notification_whatsapp_price_naira: e.target.value,
                    })
                  }
                />
                <InputWithFullBoarder
                  label="USD ($)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={creditFormData.notification_whatsapp_price_usd}
                  onChange={(e) =>
                    setCreditFormData({
                      ...creditFormData,
                      notification_whatsapp_price_usd: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Voice</p>
                <InputWithFullBoarder
                  label="Naira (₦)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={creditFormData.notification_voice_price_naira}
                  onChange={(e) =>
                    setCreditFormData({
                      ...creditFormData,
                      notification_voice_price_naira: e.target.value,
                    })
                  }
                />
                <InputWithFullBoarder
                  label="USD ($)"
                  type="number"
                  step="0.01"
                  min="0"
                  value={creditFormData.notification_voice_price_usd}
                  onChange={(e) =>
                    setCreditFormData({
                      ...creditFormData,
                      notification_voice_price_usd: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="divider my-10"></div>

      {/* Discounts Section */}
      <div className="flex items-start gap-32">
        <div className="flex flex-col items-start">
          <p className="text-16px font-semibold">Discounts</p>
          <p className="text-14px text-textGrey2 w-[200px] mb-10">
            Configure discounts for clients and partners.
          </p>
        </div>
        <div className="relative w-[546px] flex flex-col">
          {/* Existing Discounts List */}
          <div className="space-y-4 mb-6">
            {discountArray.map((discount, index) => (
              <div
                key={discount._id || index}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <div className="grid grid-cols-4 gap-4">
                  {editingId === discount._id ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          value={discount.type}
                          onChange={(e) =>
                            handleDiscountChange(index, "type", e.target.value)
                          }
                          className="w-full border rounded-md p-2"
                        >
                          <option value="default">Default</option>
                          <option value="partner">Partner</option>
                        </select>
                      </div>
                      <div>
                        <InputWithFullBoarder
                          label="Invites"
                          type="number"
                          min="0"
                          step="1"
                          value={discount.no_of_invites}
                          onChange={(e) =>
                            handleDiscountChange(
                              index,
                              "no_of_invites",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div>
                        <InputWithFullBoarder
                          label="Discount %"
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={discount.percent}
                          onChange={(e) =>
                            handleDiscountChange(
                              index,
                              "percent",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-2 mt-7">
                        <CustomButton
                          buttonText="Save"
                          onClick={() => handleEditDiscount(discount)}
                          isLoading={updatingDiscount}
                          className="w-full"
                        />
                        <CustomButton
                          buttonText="Cancel"
                          buttonColor="bg-gray-100"
                          textColor="text-gray-700"
                          onClick={() => setEditingId(null)}
                          className="w-full"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <p className="p-2 capitalize">{discount.type}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Invites
                        </label>
                        <p className="p-2">{discount.no_of_invites}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Discount %
                        </label>
                        <p className="p-2">{discount.percent}%</p>
                      </div>
                      <div className="flex items-center gap-4 mt-7">
                        <Pencil
                          className="cursor-pointer text-gray-600 hover:text-brandBlack"
                          size={20}
                          onClick={() => {
                            setDiscountId(discount.id);
                            setEditingId(discount._id);
                          }}
                        />
                        <Trash2
                          className="cursor-pointer text-redColor"
                          size={20}
                          onClick={() => {
                            setDiscountId(discount.id);
                            document.getElementById("delete").showModal();
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add New Discount Form */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-4">Add New Discount</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={newDiscount.type}
                  onChange={(e) =>
                    setNewDiscount({
                      ...newDiscount,
                      type: e.target.value,
                    })
                  }
                  className="w-full border rounded-md p-2"
                >
                  <option value="default">Default</option>
                  <option value="partner">Partner</option>
                </select>
              </div>
              <div>
                <InputWithFullBoarder
                  label="Number of Invites"
                  type="number"
                  min="0"
                  step="1"
                  value={newDiscount.no_of_invites}
                  onChange={(e) =>
                    setNewDiscount({
                      ...newDiscount,
                      no_of_invites: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <InputWithFullBoarder
                  label="Discount %"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={newDiscount.percent}
                  onChange={(e) =>
                    setNewDiscount({
                      ...newDiscount,
                      percent: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <CustomButton
              buttonText="Add Discount"
              onClick={handleAddDiscount}
              isLoading={addingDiscounts}
            />
            <DeleteConfirmationModal
              title={"Delete Discount plan"}
              body={`Are you sure you want to delete this discount plan?`}
              buttonText={"Delete Discount"}
              isLoading={deletingDiscount}
              onClick={() => deleteDiscount()}
            />
          </div>
        </div>
      </div>

      <div className="divider my-10"></div>

      {/* Partner Discounts Section */}
      <div className="flex items-start gap-32">
        <div className="flex flex-col items-start">
          <p className="text-16px font-semibold">Partner Discounts</p>
          <p className="text-14px text-textGrey2 w-[200px] mb-10">
            Configure discount tiers for partners when making users partners.
          </p>
        </div>
        <div className="relative w-[546px] flex flex-col">
          {/* Existing Partner Discounts List */}
          <div className="space-y-4 mb-6">
            {partnerDiscountArray.map((discount, index) => (
              <div
                key={discount._id || index}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <div className="grid grid-cols-5 gap-4">
                  {editingPartnerId === discount._id ? (
                    <>
                      <div>
                        <InputWithFullBoarder
                          label="Name"
                          type="text"
                          value={discount.name}
                          onChange={(e) =>
                            handlePartnerDiscountChange(index, "name", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <InputWithFullBoarder
                          label="Description"
                          type="text"
                          value={discount.description}
                          onChange={(e) =>
                            handlePartnerDiscountChange(index, "description", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <InputWithFullBoarder
                          label="Value %"
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={discount.value}
                          onChange={(e) =>
                            handlePartnerDiscountChange(index, "value", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <InputWithFullBoarder
                          label="Min Purchase"
                          type="number"
                          min="0"
                          step="1"
                          value={discount.min_purchase}
                          onChange={(e) =>
                            handlePartnerDiscountChange(index, "min_purchase", e.target.value)
                          }
                        />
                      </div>
                      <div className="flex flex-col gap-2 mt-7">
                        <CustomButton
                          buttonText="Save"
                          onClick={() => handleEditPartnerDiscount(discount)}
                          isLoading={updatingPartnerDiscount}
                          className="w-full text-sm"
                        />
                        <CustomButton
                          buttonText="Cancel"
                          buttonColor="bg-gray-100"
                          textColor="text-gray-700"
                          onClick={() => setEditingPartnerId(null)}
                          className="w-full text-sm"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <p className="p-2">{discount.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <p className="p-2 text-sm">{discount.description}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Value
                        </label>
                        <p className="p-2">{discount.value}%</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Min Purchase
                        </label>
                        <p className="p-2">{discount.min_purchase}</p>
                      </div>
                      <div className="flex items-center gap-4 mt-7">
                        <Pencil
                          className="cursor-pointer text-gray-600 hover:text-brandBlack"
                          size={20}
                          onClick={() => {
                            setDiscountId(discount.id);
                            setEditingPartnerId(discount._id);
                          }}
                        />
                        <Trash2
                          className="cursor-pointer text-redColor"
                          size={20}
                          onClick={() => {
                            setDiscountId(discount.id);
                            document.getElementById("deletePartner").showModal();
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add New Partner Discount Form */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-4">Add New Partner Discount</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <InputWithFullBoarder
                  label="Name"
                  type="text"
                  value={newPartnerDiscount.name}
                  onChange={(e) =>
                    setNewPartnerDiscount({
                      ...newPartnerDiscount,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <InputWithFullBoarder
                  label="Description"
                  type="text"
                  value={newPartnerDiscount.description}
                  onChange={(e) =>
                    setNewPartnerDiscount({
                      ...newPartnerDiscount,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <InputWithFullBoarder
                  label="Discount Value %"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={newPartnerDiscount.value}
                  onChange={(e) =>
                    setNewPartnerDiscount({
                      ...newPartnerDiscount,
                      value: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <InputWithFullBoarder
                  label="Min Purchase Amount"
                  type="number"
                  min="0"
                  step="1"
                  value={newPartnerDiscount.min_purchase}
                  onChange={(e) =>
                    setNewPartnerDiscount({
                      ...newPartnerDiscount,
                      min_purchase: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <CustomButton
              buttonText="Add Partner Discount"
              onClick={handleAddPartnerDiscount}
              isLoading={addingPartnerDiscounts}
            />
            
            <DeleteConfirmationModal
              title={"Delete Partner Discount"}
              body={`Are you sure you want to delete this partner discount?`}
              buttonText={"Delete Partner Discount"}
              isLoading={deletingPartnerDiscount}
              onClick={() => deletePartnerDiscount()}
              id="deletePartner"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigurationSection;
