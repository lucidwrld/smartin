import { useQuery } from "react-query";
import Axios from "@/constants/api_management/MyHttpHelper";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { SessionRegistrationsResponse } from "../types";

interface GetSessionRegistrationsParams {
  sessionId: string;
  enabled?: boolean;
  page?: number;
  pageSize?: number;
  code?: string;
}

const useGetSessionRegistrationsManager = ({
  sessionId,
  enabled = true,
  page = 1,
  pageSize = 10,
  code,
}: GetSessionRegistrationsParams) => {
  const axiosInstance = code ? Axios : AxiosWithToken;

  return useQuery<SessionRegistrationsResponse>({
    queryKey: ["session-registrations", sessionId, page, pageSize, code],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(
          `/sessions/${sessionId}/registrations`,
          {
            params: {
              page,
              pageSize,
              ...(code && { accessCode: code }),
            },
          }
        );
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
