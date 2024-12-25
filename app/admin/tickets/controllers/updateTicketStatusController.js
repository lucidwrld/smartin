import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const UpdateTicketStatus = ({ ticketId }) => {
  const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/support/tickets/${ticketId}`,
    ["ticket", "tickets"],
    true,
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
