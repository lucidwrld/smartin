import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { toast } from "react-toastify";

const useGetEventAnalyticsManager = ({ eventId }) => {
  return useQuery({
    queryKey: ["event_analytics", eventId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `/event/${eventId}/analytics`
        );
        return response.data;
      } catch (error) {
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    // enabled: Boolean(movieId),
    refetchOnWindowFocus: false,
  });
};

export default useGetEventAnalyticsManager;
