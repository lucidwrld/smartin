import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const RespondToInviteManager = () => {
  const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/event/respond`,
    ["invite"],
    false,
    true
  );
  const sendResponse = async (details) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    sendResponse,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
