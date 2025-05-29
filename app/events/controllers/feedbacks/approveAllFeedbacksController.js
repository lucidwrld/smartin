import useUpdateManager from "@/constants/controller_templates/put_controller_template";

export const ApproveAllFeedbacksManager = ({ eventId }) => {
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/feedbacks/event/${eventId}/approve/all`,
    ["all_event_feedbacks", "public_feedbacks"],
    false,
    true
  );

  const approveAllFeedbacks = async () => {
    try {
      await updateCaller();
    } catch (error) {
      console.error("error:", error);
    }
  };

  return {
    approveAllFeedbacks,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
