import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const UpdateSettingsManager = () => {
  const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/setting/update`,
    ["settings"],
    false,
    true
  );
  const updateSettings = async (details) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    updateSettings,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
