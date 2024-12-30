import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const ConfirmBankPaymentManager = () => {
  const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/event/payment/approve`,
    ["transactions", "events"],
    false,
    true
  );
  const confirmBankPayment = async (details) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    confirmBankPayment,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
