import useDeleteManager from "@/constants/controller_templates/delete_controller_template";

export const DeletePartnerDiscountManager = ({ discountId }) => {
  const { deleteCaller, isLoading, isSuccess, error, data } =
    useDeleteManager(
      `/user/partners/discount/${discountId}`,
      ["partnerDiscounts"],
      true
    );

  const deletePartnerDiscount = async () => {
    try {
      await deleteCaller(undefined);
    } catch (error) {
      console.error("Error deleting partner discount:", error);
    }
  };

  return {
    deletePartnerDiscount,
    data,
    isLoading,
    isSuccess,
    error,
  };
};