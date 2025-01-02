import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const EditInviteeManager = ({ inviteeId }) => {
  const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/event/invitees/${inviteeId}`,
    ["events_invitees"],
    false,
    true
  );
  const editInvitee = async (details) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    editInvitee,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
