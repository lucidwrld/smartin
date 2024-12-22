import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const UpdateProfessionalProfileManager = () => {
  const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/users/professional-profile/update`,
    ["userDetails"],
    false,
    true
  );
  const updateProfile = async (details) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    updateProfile,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
