import usePostManager from "@/constants/controller_templates/post_controller_template";
import { useRouter } from "next/navigation";

export const useRegisterUser = (email) => {
  const route = useRouter();
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager(
    `/auth/register`,
    [],
    false
  );
  const registerUser = async (details) => {
    try {
      await postCaller(details);
      if (isSuccess) {
        route.push(`/auth/verify-account?email=${email}`);
      }
    } catch (error) {
      console.error("post error:", error);
    }
  };
  return {
    registerUser,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export default useRegisterUser;
