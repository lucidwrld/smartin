import useUpdateManager from "@/constants/controller_templates/put_controller_template";

export const UpdateCreditPricingManager = () => {
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    "/pricing/credits",
    "credit-pricing",
    false,
    true,
    true
  );

  const updateCreditPricing = async (details) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };

  return {
    updateCreditPricing,
    data,
    isLoading,
    isSuccess,
    error,
  };
};