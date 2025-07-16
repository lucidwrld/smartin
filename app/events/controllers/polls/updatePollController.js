import useUpdateManager from "@/constants/controller_templates/put_controller_template";

export const UpdatePollManager = ({ pollId }) => {
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/polls/${pollId}`,
    ["event-polls"],
    true
  );

  const updatePoll = async (pollData) => {
    try {
      await updateCaller(pollData);
    } catch (error) {
      console.error("error:", error);
    }
  };

  return {
    updatePoll,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export default UpdatePollManager;
