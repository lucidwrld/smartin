import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQuery } from "react-query";

const useGetEventPollsManager = ({ eventId, enabled = true }) => {
  return useQuery({
    queryKey: ["event-polls", eventId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/polls/event/${eventId}/polls`);
        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response?.data?.message || error.message}`);
      }
    },
    enabled: enabled && !!eventId,
    refetchOnWindowFocus: false,
  });
};

export default useGetEventPollsManager;