import usePostManager from "@/constants/controller_templates/post_controller_template";

export const AddMemberManager = ({ eventId }) => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    `/event/${eventId}/members/add`,
    ["members"],
    true
  );
  const addMember = async (details) => {
    try {
      await postCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    addMember,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
