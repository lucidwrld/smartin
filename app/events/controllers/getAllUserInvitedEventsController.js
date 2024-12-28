import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

import { useQuery } from "react-query";

const useGetAllUserInvitedEventsManager = ({
  page = 1,
  pageSize = 10,
  search = "",
  status,
  enabled = true,
}) => {
  return useQuery(
    ["events", enabled, search, page, pageSize, status],
    async () => {
      try {
        const [response] = [
          await AxiosWithToken.get(`/event/invites`, {
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

export default useGetAllUserInvitedEventsManager;
