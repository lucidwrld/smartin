import usePostManager from "@/constants/controller_templates/post_controller_template";
import { useRouter } from "next/navigation";

export const CreateDiscountsManager = () => {
  const router = useRouter();
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    `/pricing/discount`,
    ["discounts"],
    true
  );
  const createDiscount = async (details) => {
    try {
      await postCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    createDiscount,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
