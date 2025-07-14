import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { SessionResponse } from "../types";

interface GetSingleSessionParams {
  sessionId: string;
  enabled?: boolean;
}

const useGetSingleSessionManager = ({ sessionId, enabled = true }: GetSingleSessionParams) => {
  return useQuery<SessionResponse>({
    queryKey: ["session", sessionId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/sessions/${sessionId}`);
        return response.data;
      } catch (error: any) {
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    enabled: enabled && Boolean(sessionId),
    refetchOnWindowFocus: false,
  });
};

export default useGetSingleSessionManager;