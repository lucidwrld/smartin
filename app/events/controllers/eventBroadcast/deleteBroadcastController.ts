import useDeleteManager from "@/constants/controller_templates/delete_controller_template";

export const DeleteBroadcastManager = ({ broadcastId }) => {
  const { deleteCaller, isLoading, isSuccess, error, data } = useDeleteManager(
    `/broadcast/${broadcastId}`,
    ["event_broadcasts"]
  );

  const deleteBroadcast = async () => {
    try {
      await deleteCaller({});
    } catch (error) {
      console.error("error:", error);
    }
  };

  return {
    deleteBroadcast,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
