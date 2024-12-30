import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const UpdateDiscountManager = ({ discountId }) => {
  const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/pricing/discount/${discountId}`,
    ["discounts"],
    false,
    true
  );
  const updateDiscounts = async (details) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    updateDiscounts,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
