import useUpdateManager from "@/constants/controller_templates/put_controller_template";

export const useResendOtp = () => {
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/auth/resend-verification`,
    [],
    false,
    false
  );
  const resendOtp = async (email) => {
    try { 
      await updateCaller(email);
      
      window.location.reload();
    } catch (error) {
      console.error("resend otp error:", error);
    }
  };
  return {
    resendOtp,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
