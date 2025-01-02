import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const OpenAllNotificationsManager = () => {
  const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/notification/open/all`,
    ["notifications"],
    false,
    true
  );
  const openAll = async () => {
    try {
      await updateCaller();
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    openAll,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
