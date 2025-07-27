import usePostManager from "@/constants/controller_templates/post_controller_template";

export const PurchaseSubscriptionManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    `/subscription/pay`,
    ["subscriptions"],
    true
  );

  const purchaseSubscription = async (details: any) => {
    try {
      await postCaller(details);
    } catch (error) {
      console.error("Error purchasing subscription:", error);
    }
  };

  return {
    purchaseSubscription,
    data,
    isLoading,
    isSuccess,
    error,
  };
};