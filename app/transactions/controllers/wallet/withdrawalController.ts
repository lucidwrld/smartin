import usePostManager from "@/constants/controller_templates/post_controller_template";

export const WithdrawalManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    "/wallet/withdrawal",
    ["wallet-withdrawals"],
    true
  );

  const processWithdrawal = async (details) => {
    try {
      await postCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };

  return {
    processWithdrawal,
    data,
    isLoading,
    isSuccess,
    error,
  };
};