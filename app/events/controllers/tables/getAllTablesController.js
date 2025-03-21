import Axios from "@/constants/api_management/MyHttpHelper";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

import { useQuery } from "react-query";

const useGetAllTablesManager = ({
  page = 1,
  pageSize = 10,
  search = "",
  eventId,
  code,
  enabled = true,
}) => {
  const axiosInstance = code ? Axios : AxiosWithToken;
  return useQuery(
    ["tables", enabled, search, page, pageSize, eventId, code],
    async () => {
      try {
        const [response] = [
          await axiosInstance.get(`/event/${eventId}/tables`, {
            params: {
              page,
              pageSize,
              ...(search && { search }),
              ...(code && { accessCode: code }),
            },
          }),
        ];

        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response.data.message}`);
      }
    },
    {
      enabled,
      refetchOnWindowFocus: false,
    }
  );
};

export default useGetAllTablesManager;
