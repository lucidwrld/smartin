import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQuery } from "react-query";

const useGetPollSubmissionsManager = ({ 
  eventId, 
  pollId, 
  page = 1, 
  pageSize = 10,
  enabled = true 
}) => {
  return useQuery({
    queryKey: ["poll-submissions", pollId, page, pageSize],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/polls/event/${eventId}/${pollId}/submissions`, {
          params: {
            page,
            pageSize,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response?.data?.message || error.message}`);
      }
    },
    enabled: enabled && !!eventId && !!pollId,
    refetchOnWindowFocus: false,
  });
};

export default useGetPollSubmissionsManager;