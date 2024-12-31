import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const RemoveInvitedGuests = ({ eventId }) => {
  const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/event/${eventId}/remove`,
    ["events_invitees"],
    false,
    true
  );
  const removeGuests = async (details) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    removeGuests,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
