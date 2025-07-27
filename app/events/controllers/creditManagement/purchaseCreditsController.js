import usePostManager from "@/constants/controller_templates/post_controller_template";

export const PurchaseCreditsManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    "/credit-management/initiate",
    ["credits", "transactions"],
    true
  );

  const purchaseCredits = async (details) => {
    try {
      await postCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };

  return {
    purchaseCredits,
    data,
    isLoading,
    isSuccess,
    error,
  };
};