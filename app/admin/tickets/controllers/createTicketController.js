import usePostManager from "@/constants/controller_templates/post_controller_template";
import { useRouter } from "next/navigation";

export const CreateTicketManager = () => {
  const route = useRouter();
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    `/support/create`,
    ["tickets"],
    true
  );
  const createTicket = async (details) => {
    try {
      await postCaller(details);
    } catch (error) {
      console.error("post error:", error);
    }
  };
  return {
    createTicket,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
