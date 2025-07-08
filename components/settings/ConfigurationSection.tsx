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

const ConfigurationSection = () => {
  const { data, isLoading } = useGetPricingsManager();
  const [discountId, setDiscountId] = useState();
  const { createPricing, isLoading: updating } = CreatePricingManager();
  const { data: discounts, isLoading: loadingDiscounts } =
    useGetDiscountsManager();
  const { createDiscount, isLoading: addingDiscounts } =
    CreateDiscountsManager();
  const { updateDiscounts, isLoading: updatingDiscount } =
    UpdateDiscountManager({ discountId: discountId });
  const {
    deleteDiscount,
    isLoading: deletingDiscount,
    isSuccess,
  } = DeleteDiscountManager({ discountId: discountId });

  const [formData, setFormData] = useState({
    price_per_invite_naira: 0,
    price_per_invite_usd: 0,
  });

  const [discountArray, setDiscountArray] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newDiscount, setNewDiscount] = useState({
    no_of_invites: "",
    percent: "",
    type: "default",
  });

  useEffect(() => {
    if (isSuccess) {
      document.getElementById("delete").closest();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (data?.data) {
      setFormData({
        price_per_invite_naira: Number(data.data.price_per_invite_naira) || 0,
        price_per_invite_usd: Number(data.data.price_per_invite_usd) || 0,
      });
    }
  }, [data]);

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

  const handleSavePricingChanges = () => {
    const updatedFormData = {
      price_per_invite_naira: Number(formData.price_per_invite_naira) || 0,
      price_per_invite_usd: Number(formData.price_per_invite_usd) || 0,
    };
    createPricing(updatedFormData);
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

  if (isLoading || loadingDiscounts) return <Loader />;

  return (
    <div className="flex w-full bg-white rounded-lg flex-col text-brandBlack p-10">
      {/* Pricing Section */}
      <div className="flex items-start gap-32">
        <div className="flex flex-col items-start">
          <p className="text-16px font-semibold">Invites Pricing</p>
          <p className="text-14px text-textGrey2 w-[200px] mb-10">
            Set and configure invite pricing
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
              label="Price per invite ($)"
              placeholder="$ 0.00"
              type="number"
              step="0.01"
              min="0"
              value={formData.price_per_invite_naira}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price_per_invite_naira: e.target.value,
                })
              }
            />
            <InputWithFullBoarder
              label="Price per invite (NGN)"
              placeholder="NGN 0.00"
              type="number"
              step="0.01"
              min="0"
              value={formData.price_per_invite_usd}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  price_per_invite_usd: e.target.value,
                })
              }
            />
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
    </div>
  );
};

export default ConfigurationSection;
