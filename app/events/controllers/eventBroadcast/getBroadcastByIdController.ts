import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

export const useGetBroadcastByIdManager = (broadcastId: string) => {
  return useQuery(
    ["event_broadcasts", broadcastId],
    async () => {
      try {
        const response = await AxiosWithToken.get(`/broadcast/${broadcastId}`);
        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response.data.message}`);
      }
    },
    {
      refetchOnWindowFocus: false,
      enabled: !!broadcastId,
    }
  );
};
