import useUpdateManager from "@/constants/controller_templates/put_controller_template";

export const ApproveFeedbackManager = ({ eventId }) => {
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/feedbacks/event/${eventId}/approve`,
    ["all_event_feedbacks", "public_feedbacks"],
    false,
    true
  );

  const approveFeedback = async (details) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };

  return {
    approveFeedback,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
