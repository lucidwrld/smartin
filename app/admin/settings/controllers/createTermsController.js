import usePostManager from "@/constants/controller_templates/post_controller_template";
import { useRouter } from "next/navigation";

export const CreateTermsManager = () => {
  const router = useRouter();
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    `/terms/create`,
    ["terms"],
    true
  );
  const createTerms = async (details) => {
    try {
      await postCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    createTerms,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
