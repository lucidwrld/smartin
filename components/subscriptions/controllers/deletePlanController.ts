import useDeleteManager from "@/constants/controller_templates/delete_controller_template";

export const DeletePlanManager = ({ planId }) => {
  const { deleteCaller, isLoading, isSuccess, error, data } = useDeleteManager(
    `/subscription/plan/${planId}`,
    ["subscription-plans"],
    true
  );

  const deletePlan = async () => {
    try {
      await deleteCaller();
    } catch (error) {
      console.error("Error deleting plan:", error);
    }
  };

  return {
    deletePlan,
    data,
    isLoading,
    isSuccess,
    error,
  };
};