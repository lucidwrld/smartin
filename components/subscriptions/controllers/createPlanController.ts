import usePostManager from "@/constants/controller_templates/post_controller_template";

export const CreatePlanManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    `/subscription/plan`,
    ["subscription-plans"],
    true
  );

  const createPlan = async (details: any) => {
    try {
      await postCaller(details);
    } catch (error) {
      console.error("Error creating plan:", error);
    }
  };

  return {
    createPlan,
    data,
    isLoading,
    isSuccess,
    error,
  };
};