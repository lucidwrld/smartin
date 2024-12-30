import useDeleteManager from "@/constants/controller_templates/delete_controller_template";
import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const DeleteDiscountManager = ({ discountId }) => {
  const router = useRouter();

  const { deleteCaller, isLoading, isSuccess, error, data } = useDeleteManager(
    `/pricing/discount/${discountId}`,
    ["discounts"]
  );
  const deleteDiscount = async () => {
    try {
      await deleteCaller();
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    deleteDiscount,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
