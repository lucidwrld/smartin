import usePostManager from "@/constants/controller_templates/post_controller_template";

export const SubmitFeedbackManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    `/feedbacks`,
    ["feedbacks"],
    true
  );

  const submitFeedback = async (details) => {
    try {
      await postCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };

  return {
    submitFeedback,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
