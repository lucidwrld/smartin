import usePostManager from "@/constants/controller_templates/post_controller_template";

export const CreateBroadcastManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    "/broadcast",
    ["event_broadcasts"],
    true
  );

  const createBroadcast = async (details) => {
    try {
      await postCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };

  return {
    createBroadcast,
    data,
    isLoading,
    isSuccess,
    error,
  };
};