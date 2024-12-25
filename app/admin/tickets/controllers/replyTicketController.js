import usePostManager from "@/constants/controller_templates/post_controller_template";
import { useRouter } from "next/navigation";

export const ReplyTicketManager = () => {
  const route = useRouter();
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    `/support/tickets/reply`,
    ["tickets_messages"],
    true
  );
  const replyTicket = async (details) => {
    try {
      await postCaller(details);
    } catch (error) {
      console.error("post error:", error);
    }
  };
  return {
    replyTicket,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
