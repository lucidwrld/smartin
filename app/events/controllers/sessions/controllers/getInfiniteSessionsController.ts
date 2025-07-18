import { useInfiniteQuery } from "react-query";
import Axios from "@/constants/api_management/MyHttpHelper";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { SessionsResponse } from "../types";

interface GetInfiniteSessionsParams {
  eventId: string;
  enabled?: boolean;
  pageSize?: number;
  code?: string;
}

const useGetInfiniteSessionsManager = ({ eventId, enabled = true, pageSize = 10, code }: GetInfiniteSessionsParams) => {
  const axiosInstance = code ? Axios : AxiosWithToken;
  
  return useInfiniteQuery<SessionsResponse>({
    queryKey: ["sessions-infinite", eventId, pageSize, code],
    queryFn: async ({ pageParam = 1 }) => {
      try {
        const response = await axiosInstance.get(`/sessions/event/${eventId}`, {
          params: {
            page: pageParam,
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
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data?.pagination;
      if (pagination && pagination.nextPage) {
        return pagination.nextPage;
      }
      return undefined;
    },
    getPreviousPageParam: (firstPage) => {
      const pagination = firstPage.data?.pagination;
      if (pagination && pagination.prevPage) {
        return pagination.prevPage;
      }
      return undefined;
    },
  });
};

export default useGetInfiniteSessionsManager;