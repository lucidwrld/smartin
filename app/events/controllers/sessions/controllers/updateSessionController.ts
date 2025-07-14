import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import { UpdateSessionPayload, SessionResponse } from "../types";

export const UpdateSessionManager = (sessionId: string) => {
  const { updateCaller, isLoading, isSuccess, error, data } = useUpdateManager(
    `/sessions/${sessionId}`,
    ["sessions", "session"],
    true,
    true,
    true
  );

  const updateSession = async (sessionData: UpdateSessionPayload) => {
    try {
      await updateCaller(sessionData);
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };

  return {
    updateSession,
    data: data as SessionResponse,
    isLoading,
    isSuccess,
    error,
  };
};

export default UpdateSessionManager;