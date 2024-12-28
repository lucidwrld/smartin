import usePostManager from "@/constants/controller_templates/post_controller_template";

export const SubmitBankPaymentManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    `/event/pay/bank`,
    ["transactions", "event"],
    true
  );
  const submitPayment = async (details) => {
    try {
      await postCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    submitPayment,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
