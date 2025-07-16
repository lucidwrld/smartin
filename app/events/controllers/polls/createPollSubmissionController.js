import usePostManager from "@/constants/controller_templates/post_controller_template";

export const CreatePollSubmissionManager = ({ eventId, pollId }) => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    `/polls/event/${eventId}/${pollId}/submission`,
    ["event-polls"],
    true
  );

  const createPollSubmission = async (submissionData) => {
    try {
      await postCaller(submissionData);
    } catch (error) {
      console.error("error:", error);
    }
  };

  return {
    createPollSubmission,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export default CreatePollSubmissionManager;
