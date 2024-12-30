import usePostManager from "@/constants/controller_templates/post_controller_template";
import { useRouter } from "next/navigation";

export const AddTableManager = () => {
  const router = useRouter();
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    `/event/table`,
    ["tables"],
    true
  );
  const addTable = async (details) => {
    try {
      await postCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    addTable,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
