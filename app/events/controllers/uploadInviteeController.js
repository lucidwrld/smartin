import usePostManager from "@/constants/controller_templates/post_controller_template";
import { useRouter } from "next/navigation";

export const UploadInviteeManager = ({ eventId }) => {
  const router = useRouter();
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    `/event/${eventId}/invitees/upload`,
    ["events_invitees"],
    true
  );
  const uploadInvitees = async (details) => {
    try {
      await postCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    uploadInvitees,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
