import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

export const useGetBroadcastsForEventManager = (eventId: string) => {
  return useQuery(
    ["event_broadcasts", "event", eventId],
    async () => {
      try {
        const response = await AxiosWithToken.get(
          `/broadcast/event/${eventId}`
        );
        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response.data.message}`);
      }
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!eventId,
    }
  );
};
