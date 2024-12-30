import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const SuspendEventManager = ({ eventId }) => {
  // const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/event/${eventId}/suspend`,
    ["events", "event"],
    true,
    true
  );
  const suspendEvent = async () => {
    try {
      await updateCaller();
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    suspendEvent,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
