import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

import { useQuery } from "react-query";

const useGetAllTablesManager = ({
  page = 1,
  pageSize = 10,
  search = "",
  eventId,

  enabled = true,
}) => {
  return useQuery(
    ["tables", enabled, search, page, pageSize, eventId],
    async () => {
      try {
        const [response] = [
          await AxiosWithToken.get(`/event/${eventId}/tables`, {
            params: {
              page,
              pageSize,
              ...(search && { search }),
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
