import usePostManager from "@/constants/controller_templates/post_controller_template";
import { useRouter } from "next/navigation";

export const ResendBroadcastManager = ({ id }) => {
  const route = useRouter();
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    `/notification/broadcast/${id}`,
    ["broadcasts"],
    true
  );
  const sendBroadcast = async (details) => {
    try {
      await postCaller(details);
    } catch (error) {
      console.error("post error:", error);
    }
  };
  return {
    sendBroadcast,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
