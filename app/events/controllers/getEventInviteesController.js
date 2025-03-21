import Axios from "@/constants/api_management/MyHttpHelper";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

import { useQuery } from "react-query";

const useGetEventInviteesManager = ({
  page = 1,
  pageSize = 10,
  search = "",
  enabled = true,
  eventId,
  assigned,
  code,
}) => {
  const axiosInstance = code ? Axios : AxiosWithToken;
  return useQuery(
    [
      "events_invitees",
      enabled,
      search,
      page,
      pageSize,
      eventId,
      assigned,
      code,
    ],
    async () => {
      try {
        const [response] = [
          await axiosInstance.get(`/event/${eventId}/invitees`, {
            params: {
              page,
              pageSize,
              ...(search && { search }),
              ...(code && { accessCode: code }),
              ...(assigned !== undefined && { assigned }),
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
