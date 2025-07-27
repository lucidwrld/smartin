import usePutManager from "@/constants/controller_templates/put_controller_template";

export const CancelSubscriptionManager = () => {
  const { putCaller, isLoading, isSuccess, error, data } = usePutManager(
    `/api/v1/subscription/cancel`,
    ["subscriptions"],
    true
  );

  const cancelSubscription = async () => {
    try {
      await putCaller({});
    } catch (error) {
      console.error("Error canceling subscription:", error);
    }
  };

  return {
    cancelSubscription,
    data,
    isLoading,
    isSuccess,
    error,
  };
};