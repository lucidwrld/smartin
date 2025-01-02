import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const EditBroadcastManager = ({ id }) => {
  const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/notification/broadcast/${id}`,
    ["broadcasts"],
    false,
    true
  );
  const editBroadcast = async (details) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    editBroadcast,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
