import useUpdateManager from "@/constants/controller_templates/put_controller_template";

export const UpdateBroadcastManager = ({ broadcastId }) => {
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/broadcast/${broadcastId}`,
    ["event_broadcasts"],
    true,
    true,
    true
  );

  const updateBroadcast = async (details) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };

  return {
    updateBroadcast,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
