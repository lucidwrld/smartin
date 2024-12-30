import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const EditTableManager = ({ tableId }) => {
  const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/event/tables/${tableId}`,
    ["tables", "table"],
    true,
    true
  );
  const editTable = async (details) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    editTable,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
