import usePostManager from "@/constants/controller_templates/post_controller_template";
import { SessionAttendancePayload, BaseResponse } from "../types";

export const SessionAttendanceManager = (sessionId: string) => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<BaseResponse>(
    `/sessions/${sessionId}/attendance/mark`,
    ["session-attendance", "sessions"],
    true
  );

  const markAttendance = async (attendanceData: SessionAttendancePayload) => {
    try {
      await postCaller(attendanceData);
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