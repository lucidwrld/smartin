import useUpdateManager from "@/constants/controller_templates/put_controller_template";

export const RemoveMemberManager = ({ eventId, memberId }) => {
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/event/${eventId}/members/${memberId}/remove`,
    ["members"],
    false,
    true
  );
  const removeMember = async () => {
    try {
      await updateCaller();
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    removeMember,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
