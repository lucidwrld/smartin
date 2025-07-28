import useUpdateManager from "@/constants/controller_templates/put_controller_template";

export const VerifyWithdrawalOtpManager = () => {
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    "/wallet/withdrawal/otp",
    ["wallet-withdrawals"],
    true,
    true,
    true
  );

  const verifyWithdrawalOtp = async (details) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };

  return {
    verifyWithdrawalOtp,
    data,
    isLoading,
    isSuccess,
    error,
  };
};