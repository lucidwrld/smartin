import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

import { useQuery } from "react-query";

const useGetAllTestNotificationsManager = ({
  page = 1,
  pageSize = 10,
  search = "",
  status,
  enabled = true,
}) => {
  return useQuery(
    ["notify_test", enabled, search, page, pageSize, status],
    async () => {
      try {
        const [response] = [
          await AxiosWithToken.get(`/notification`, {
            params: {
              page,
              pageSize,
              ...(search && { search }),
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

export default useGetAllTestNotificationsManager;
