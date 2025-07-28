import usePostManager from "@/constants/controller_templates/post_controller_template";

export const SendBroadcastManager = ({ broadcastId }) => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    `/broadcast/send/${broadcastId}`,
    ["event_broadcasts"],
    true
  );

  const sendBroadcast = async () => {
    try {
      await postCaller({});
    } catch (error) {
      console.error("error:", error);
    }
  };

  return {
    sendBroadcast,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
