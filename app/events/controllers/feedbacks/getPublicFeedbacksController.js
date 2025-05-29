import { useQuery } from "react-query";
import Axios from "@/constants/api_management/MyHttpHelper";

const useGetPublicFeedbacksManager = ({ eventId, enabled = true }) => {
  return useQuery({
    queryKey: ["public_feedbacks", eventId],
    queryFn: async () => {
      try {
        const response = await Axios.get(`/feedbacks/event/${eventId}`);
        return response.data;
      } catch (error) {
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    enabled: Boolean(eventId) && enabled,
    refetchOnWindowFocus: false,
  });
};

export default useGetPublicFeedbacksManager;
