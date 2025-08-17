import usePostManager from "@/constants/controller_templates/post_controller_template";

export const CreatePartnerDiscountManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager("/user/partners/discount", ["partnerDiscounts"], true);

  const createPartnerDiscount = async (discountData) => {
    try {
      await postCaller(discountData);
    } catch (error) {
      console.error("Error creating partner discount:", error);
    }
  };

  return {
    createPartnerDiscount,
    data,
    isLoading,
    isSuccess,
    error,
  };
};