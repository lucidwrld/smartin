import usePostManager from "@/constants/controller_templates/post_controller_template";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const ForgotPasswordManager = (email) => {
  const router = useRouter();

  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    `/auth/password-request`,
    [],
    false
  );
  useEffect(() => {
    if (isSuccess) {
      router.push(`/auth/reset-password?email=${email}`);
    }
  }, [isSuccess]);
  const sendEmail = async (details) => {
    try {
      await postCaller(details);
    } catch (error) {
      console.error("post error:", error);
    }
  };
  return {
    sendEmail,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
