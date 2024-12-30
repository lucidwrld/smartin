import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const ActivateDeactivateEvent = ({ eventId }) => {
  // const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/event/${eventId}/deactivate`,
    ["events", "event"],
    true,
    true
  );
  const manageEvent = async () => {
    try {
      await updateCaller();
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    manageEvent,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
