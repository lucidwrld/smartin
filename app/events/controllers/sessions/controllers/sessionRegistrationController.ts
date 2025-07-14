import usePostManager from "@/constants/controller_templates/post_controller_template";
import { SessionRegistrationPayload, BaseResponse } from "../types";

export const SessionRegistrationManager = (sessionId: string) => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<BaseResponse>(
    `/sessions/${sessionId}/register`,
    ["session-registrations", "sessions"],
    true
  );

  const registerForSession = async (registrationData: SessionRegistrationPayload) => {
    try {
      await postCaller(registrationData);
    } catch (error) {
      console.error("Error registering for session:", error);
    }
  };

  return {
    registerForSession,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export default SessionRegistrationManager;