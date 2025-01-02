import useDeleteManager from "@/constants/controller_templates/delete_controller_template";
import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const DeleteBroadcastManager = ({ id }) => {
  const router = useRouter();
  const { deleteCaller, isLoading, isSuccess, error, data } = useDeleteManager(
    `/notification/broadcast/${id}`,
    ["notifications"]
  );
  const deleteBroadcast = async () => {
    try {
      await deleteCaller();
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    deleteBroadcast,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
