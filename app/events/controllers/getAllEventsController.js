import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

import { useQuery } from "react-query";

const useGetAllEventsManager = ({
  page = 1,
  pageSize = 10,
  search = "",
  user,
  status,
  enabled = true,
}) => {
  return useQuery(
    ["events", enabled, search, page, pageSize, user, status],
    async () => {
      try {
        const [response] = [
          await AxiosWithToken.get(`/event/list`, {
            params: {
              page,
              pageSize,
              ...(search && { search }),
              ...(user && { user }),
              ...(status && { status }),
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

export default useGetAllEventsManager;
