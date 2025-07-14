import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { SessionRegistrationsResponse } from "../types";

interface GetSessionRegistrationsParams {
  sessionId: string;
  enabled?: boolean;
  page?: number;
  limit?: number;
}

const useGetSessionRegistrationsManager = ({ 
  sessionId, 
  enabled = true, 
  page = 1, 
  limit = 10 
}: GetSessionRegistrationsParams) => {
  return useQuery<SessionRegistrationsResponse>({
    queryKey: ["session-registrations", sessionId, page, limit],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/sessions/${sessionId}/registrations`, {
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

export default useGetSessionRegistrationsManager;