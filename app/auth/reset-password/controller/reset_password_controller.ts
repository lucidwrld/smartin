import useUpdateManager from "@/constants/controller_templates/put_controller_template";

import { useRouter } from "next/navigation";

export const ResetPasswordManager = ({ password }) => {
  const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/auth/password-reset`,
    [],
    false,
    false
  );
  const resetPassword = async (email) => {
    try {
      await updateCaller(email);
    } catch (error) {
      console.error("password reset error:", error);
    }
  };
  return {
    resetPassword,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
