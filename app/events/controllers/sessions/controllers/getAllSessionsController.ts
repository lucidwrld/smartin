import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { SessionsResponse } from "../types";

interface GetAllSessionsParams {
  eventId: string;
  enabled?: boolean;
  page?: number;
  limit?: number;
}

const useGetAllSessionsManager = ({ eventId, enabled = true, page = 1, limit = 10 }: GetAllSessionsParams) => {
  return useQuery<SessionsResponse>({
    queryKey: ["sessions", eventId, page, limit],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/sessions/event/${eventId}`, {
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
    enabled: enabled && Boolean(eventId),
    refetchOnWindowFocus: false,
  });
};

export default useGetAllSessionsManager;