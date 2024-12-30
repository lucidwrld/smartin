import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const SuspendUnsuspendUserManager = ({ userId }) => {
  const router = useRouter();

  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/user/${userId}/suspend`,
    ["user", "users"],
    true,
    true
  );
  const manageSuspend = async () => {
    try {
      await updateCaller();
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    manageSuspend,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
