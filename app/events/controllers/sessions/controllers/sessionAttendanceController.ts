import usePostManager from "@/constants/controller_templates/post_controller_template";
import { SessionAttendancePayload, BaseResponse } from "../types";

export const SessionAttendanceManager = (sessionId: string, accessCode?: string) => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<BaseResponse>(
    `/sessions/${sessionId}/attendance/mark`,
    ["session-attendance", "sessions"],
    !accessCode // authentication is false when accessCode exists
  );

  const markAttendance = async (attendanceData: SessionAttendancePayload) => {
    try {
      const payload = accessCode 
        ? { ...attendanceData, accessCode }
        : attendanceData;
      
      await postCaller(payload);
    } catch (error) {
      console.error("Error marking session attendance:", error);
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

export default SessionAttendanceManager;