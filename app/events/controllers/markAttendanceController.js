import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const MarkAttendanceManager = () => {
  const router = useRouter();
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/event/attendance/`,
    ["events_invitees"],
    false,
    true
  );
  const markAttendance = async (details) => {
    try {
      await updateCaller(details);
    } catch (error) {
      console.error("error:", error);
    }
  };
  return {
    markAttendance,
    data,
    isLoading,
    isSuccess,
    error,
  };
};
