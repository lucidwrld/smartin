import usePutManager from "@/constants/controller_templates/put_controller_template";

export const UpdatePlanManager = ({ planId }) => {
  const { updateCaller, isLoading, isSuccess, error, data } = usePutManager(
    `/subscription/plan/${planId}`,
    ["subscription-plans"],
    true
  );

  const updatePlan = async (details: any) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("Error updating plan:", error);
    }
  };

  return {
    updatePlan,
    data,
    isLoading,
    isSuccess,
    error,
  };
};