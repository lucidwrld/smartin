import { useQuery } from "react-query";
import Axios from "@/constants/api_management/MyHttpHelper";

const useGetSingleEventPublicManager = ({ eventId, enabled }) => {
  return useQuery({
    queryKey: ["public_event", eventId], // Add to the query key
    queryFn: async () => {
      try {
        const response = await Axios.get(`/event/public/${eventId}`);
        return response.data;
      } catch (error) {
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

export default useGetSingleEventPublicManager;
