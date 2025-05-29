import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

const useGetAllEventFeedbacksManager = ({
  eventId,
  page = 1,
  pageSize = 10,
  enabled = true,
}) => {
  return useQuery({
    queryKey: ["all_event_feedbacks", eventId, page, pageSize],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `/feedbacks/event/${eventId}/all`,
          {
            params: {
              page,
              pageSize,
            },
          }
        );
        return response.data;
      } catch (error) {
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    enabled: Boolean(eventId) && enabled,
    refetchOnWindowFocus: false,
  });
};

export default useGetAllEventFeedbacksManager;
