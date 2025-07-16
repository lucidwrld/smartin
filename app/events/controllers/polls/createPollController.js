import usePostManager from "@/constants/controller_templates/post_controller_template";

export const CreatePollManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    `/polls`,
    ["event-polls"],
    true
  );

  const createPoll = async (pollData) => {
    try {
      await postCaller(pollData);
    } catch (error) {
      console.error("error:", error);
    }
  };

  return {
    createPoll,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export default CreatePollManager;
