import usePostManager from "@/constants/controller_templates/post_controller_template";

export const AddInviteesManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    `/event/invitees/add`,
    ["events_invitees"],
    true
  );
  const addInvitees = async (details) => {
    try {
      await postCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    addInvitees,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
