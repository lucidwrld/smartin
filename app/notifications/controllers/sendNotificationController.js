import usePostManager from "@/constants/controller_templates/post_controller_template";
import { useRouter } from "next/navigation";

export const SendNotificationManager = ({ eventId }) => {
  const router = useRouter();
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    `/event/${eventId}/invitees/notify`,
    ["notify"],
    true
  );
  const sendNotification = async (details) => {
    try {
      await postCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    sendNotification,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
