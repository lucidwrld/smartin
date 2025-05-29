import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

const useGetSingleFeedbackManager = ({
  eventId,
  feedbackId,
  enabled = true,
}) => {
  return useQuery({
    queryKey: ["single_feedback", eventId, feedbackId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `/feedbacks/event/${eventId}/feedback/${feedbackId}`
        );
        return response.data;
      } catch (error) {
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    enabled: Boolean(eventId) && Boolean(feedbackId) && enabled,
    refetchOnWindowFocus: false,
  });
};

export default useGetSingleFeedbackManager;
