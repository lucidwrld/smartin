import usePostManager from "@/constants/controller_templates/post_controller_template";
import { useRouter } from "next/navigation";

export const CreatePricingManager = () => {
  const router = useRouter();
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    `/pricing`,
    ["pricing"],
    true
  );
  const createPricing = async (details) => {
    try {
      await postCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    createPricing,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
