import useUpdateManager from "@/constants/controller_templates/put_controller_template";

export const AddUserCreditsManager = () => {
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    "/credit-management/balance/credit",
    ["credits", "user-credits"],
    true,
    true,
    true
  );

  const addUserCredits = async (details) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };

  return {
    addUserCredits,
    data,
    isLoading,
    isSuccess,
    error,
  };
};