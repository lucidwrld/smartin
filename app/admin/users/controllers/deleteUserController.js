import useDeleteManager from "@/constants/controller_templates/delete_controller_template";
import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const DeleteUserManager = ({ userId }) => {
  const router = useRouter();

  const { deleteCaller, isLoading, isSuccess, error, data } = useDeleteManager(
    `/user/${userId}`,
    ["users"]
  );
  const deleteUser = async () => {
    try {
      await deleteCaller();
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    deleteUser,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
