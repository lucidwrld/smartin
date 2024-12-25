import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const EditReplyManager = ({ messageId }) => {
  const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/support/tickets/message/${messageId}`,
    ["ticket_messages"],
    false,
    true
  );
  const updateStatus = async (details) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    updateStatus,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
