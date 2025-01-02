import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const OpenSingleNotificationManager = () => {
  const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/notification/update`,
    ["notifications"],
    false,
    true
  );
  const openNotification = async (details) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    openNotification,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
