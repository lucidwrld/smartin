import usePostManager from "@/constants/controller_templates/post_controller_template";

export const CreateCreditPricingManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    "/pricing/credits",
    ["credit-pricing"],
    true
  );

  const createCreditPricing = async (details) => {
    try {
      await postCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };

  return {
    createCreditPricing,
    data,
    isLoading,
    isSuccess,
    error,
  };
};