import useDeleteManager from "@/constants/controller_templates/delete_controller_template";
import { BaseResponse } from "../types";

export const DeleteSessionManager = (sessionId: string) => {
  const { deleteCaller, isLoading, isSuccess, error, data } = useDeleteManager(
    `/sessions/${sessionId}`,
    ["sessions", "session"]
  );

  const deleteSession = async (sessionData?: any) => {
    try {
      await deleteCaller(sessionData || {});
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  };

  return {
    deleteSession,
    data: data as BaseResponse,
    isLoading,
    isSuccess,
    error,
  };
};

export default DeleteSessionManager;