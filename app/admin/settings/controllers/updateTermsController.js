import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const UpdateTermsManager = () => {
  const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/terms/update`,
    ["terms"],
    false,
    true
  );
  const updateTerms = async (details) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    updateTerms,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
