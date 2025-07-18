import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { useRouter } from "next/navigation";

export const MarkAttendanceManager = (accessCode) => {
  const router = useRouter();
  const endpoint = accessCode ? `/event/attendance/?code=${accessCode}` : `/event/attendance/`;
  
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    endpoint,
    "events_invitees",
    false, // isMulti
    !accessCode // authentication is false when accessCode exists
  );
  
  const markAttendance = async (details) => {
    try {
      const payload = {
        inviteeId: details.inviteeId,
        attended: true
      };
      await updateCaller(payload);
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
