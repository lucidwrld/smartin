import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { changeUserPassword } from "@/constants/firebase/firebaseAuth";
import { useRouter } from "next/navigation";

export const ChangePasswordManager = ({password}) => {
  const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/users/profile/reset-password`,
    [""],
    false,
    true
  );
  const changePassword = async (details) => {
    try {
      await updateCaller(details); 
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    changePassword,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
