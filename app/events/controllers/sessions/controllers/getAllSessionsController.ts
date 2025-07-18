import { useQuery } from "react-query";
import Axios from "@/constants/api_management/MyHttpHelper";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { SessionsResponse } from "../types";

interface GetAllSessionsParams {
  eventId: string;
  enabled?: boolean;
  page?: number;
  pageSize?: number;
  code?: string;
}

const useGetAllSessionsManager = ({ eventId, enabled = true, page = 1, pageSize = 10, code }: GetAllSessionsParams) => {
  const axiosInstance = code ? Axios : AxiosWithToken;
  
  return useQuery<SessionsResponse>({
    queryKey: ["sessions", eventId, page, pageSize, code],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/sessions/event/${eventId}`, {
          params: {
            page,
            pageSize,
            ...(code && { accessCode: code }),
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