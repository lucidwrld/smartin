import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const MakeUserPartnerManager = ({ userId }) => {
  const router = useRouter();

  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/user/${userId}/partner`,
    ["user", "users"],
    true,
    true
  );
  const makePartner = async () => {
    try {
      await updateCaller();
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
