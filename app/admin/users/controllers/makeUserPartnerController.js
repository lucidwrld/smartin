import useUpdateManager from "@/constants/controller_templates/put_controller_template";

export const MakeUserPartnerManager = () => {
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/user/partners/add`,
    ["user", "users"],
    true,
    true
  );
  const makePartner = async (payload) => {
    try {
      await updateCaller(payload);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    makePartner,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const RemoveUserPartnerManager = () => {
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/user/partners/remove`,
    ["user", "users"],
    true,
    true
  );
  const removePartner = async (payload) => {
    try {
      await updateCaller(payload);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    removePartner,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
