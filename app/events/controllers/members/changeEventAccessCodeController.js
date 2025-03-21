import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const ChangeAccessCodeManager = ({ eventId }) => {
  const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/event/${eventId}/access-code`,
    ["accessCodes"],
    false,
    true
  );
  const changeAccessCode = async (details) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    changeAccessCode,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
