import usePutManager from "@/constants/controller_templates/put_controller_template";

export const RenewSubscriptionManager = ({ subscriptionId }) => {
  const { putCaller, isLoading, isSuccess, error, data } = usePutManager(
    `/subscription/${subscriptionId}/renew`,
    ["subscriptions"],
    true
  );

  const renewSubscription = async (details: any) => {
    try {
      await putCaller(details);
    } catch (error) {
      console.error("Error renewing subscription:", error);
    }
  };

  return {
    renewSubscription,
    data,
    isLoading,
    isSuccess,
    error,
  };
};