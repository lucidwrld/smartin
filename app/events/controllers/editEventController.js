import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const EditEventManager = ({ eventId }) => {
  const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/event/${eventId}`,
    ["events"],
    false,
    true
  );
  const updateEvent = async (details) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    updateEvent,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
