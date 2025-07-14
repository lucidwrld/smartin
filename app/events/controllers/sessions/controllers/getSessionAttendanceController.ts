import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { SessionAttendanceResponse } from "../types";

interface GetSessionAttendanceParams {
  sessionId: string;
  enabled?: boolean;
  page?: number;
  limit?: number;
}

const useGetSessionAttendanceManager = ({ 
  sessionId, 
  enabled = true, 
  page = 1, 
  limit = 10 
}: GetSessionAttendanceParams) => {
  return useQuery<SessionAttendanceResponse>({
    queryKey: ["session-attendance", sessionId, page, limit],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/sessions/${sessionId}/attendance`, {
          params: {
            page,
            limit,
          },
        });
        return response.data;
      } catch (error: any) {
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    enabled: enabled && Boolean(sessionId),
    refetchOnWindowFocus: false,
  });
};

export default useGetSessionAttendanceManager;