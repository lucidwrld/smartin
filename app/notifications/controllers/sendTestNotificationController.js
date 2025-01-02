import usePostManager from "@/constants/controller_templates/post_controller_template";
import { useRouter } from "next/navigation";

export const SendTestNotificationManager = () => {
  const router = useRouter();
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    `/event/test`,
    ["notify_test"],
    false
  );
  const sendTestNotification = async (details) => {
    try {
      await postCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    sendTestNotification,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
