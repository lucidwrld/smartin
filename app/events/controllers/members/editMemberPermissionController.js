import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const UpdateMemberPermissionManager = ({ eventId, memberId }) => {
  const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/event/${eventId}/members/${memberId}`,
    ["members"],
    false,
    true
  );
  const updateMember = async (details) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    updateMember,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
