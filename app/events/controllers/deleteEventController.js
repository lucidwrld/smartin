import useDeleteManager from "@/constants/controller_templates/delete_controller_template";
import { useRouter } from "next/navigation";

export const DeleteEventManager = ({ eventId }) => {
  const router = useRouter();
  const { deleteCaller, isLoading, isSuccess, error, data } = useDeleteManager(
    `/event/${eventId}`,
    ["events"]
  );
  const deleteEvent = async (details) => {
    try {
      await deleteCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    deleteEvent,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
