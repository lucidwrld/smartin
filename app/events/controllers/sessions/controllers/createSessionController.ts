import usePostManager from "@/constants/controller_templates/post_controller_template";
import { CreateSessionPayload, SessionResponse } from "../types";

export const CreateSessionManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } = usePostManager<SessionResponse>(
    `/sessions`,
    ["sessions"],
    true
  );

  const createSession = async (sessionData: CreateSessionPayload) => {
    try {
      await postCaller(sessionData);
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  return {
    createSession,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export default CreateSessionManager;