import usePostManager from "@/constants/controller_templates/post_controller_template";

export const CalculateTotalCostManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    "/pricing/credits/calculate",
    ["credit-pricing"],
    true
  );

  const calculateTotalCost = async (details) => {
    try {
      await postCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };

  return {
    calculateTotalCost,
    data,
    isLoading,
    isSuccess,
    error,
  };
};