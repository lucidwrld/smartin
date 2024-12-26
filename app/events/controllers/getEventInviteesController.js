import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

import { useQuery } from "react-query";

const useGetEventInviteesManager = ({
  page = 1,
  pageSize = 10,
  search = "",
  enabled = true,
  eventId,
}) => {
  return useQuery(
    ["events_invitees", enabled, search, page, pageSize, eventId],
    async () => {
      try {
        const [response] = [
          await AxiosWithToken.get(`/event/${eventId}/invitees`, {
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

export default useGetEventInviteesManager;
