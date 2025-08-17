import useUpdateManager from "@/constants/controller_templates/put_controller_template";

export const UpdatePartnerDiscountManager = ({ discountId }) => {
  const { updateCaller, isLoading, isSuccess, error, data } =
    useUpdateManager(
      `/user/partners/discount/${discountId}`,
      ["partnerDiscounts"],
      true
    );

  const updatePartnerDiscount = async (discountData) => {
    try {
      await updateCaller(discountData);
    } catch (error) {
      console.error("Error updating partner discount:", error);
    }
  };

  return {
    updatePartnerDiscount,
    data,
    isLoading,
    isSuccess,
    error,
  };
};