import useDeleteManager from "@/constants/controller_templates/delete_controller_template";
import { useRouter } from "next/navigation";

export const DeleteTableManager = ({ tableId }) => {
  const router = useRouter();
  const { deleteCaller, isLoading, isSuccess, error, data } = useDeleteManager(
    `/event/tables/${tableId}`,
    ["tables"]
  );
  const deleteTable = async (details) => {
    try {
      await deleteCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    deleteTable,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
