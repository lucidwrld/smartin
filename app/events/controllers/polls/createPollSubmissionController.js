import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useMutation, useQueryClient } from "react-query";

const useCreatePollSubmissionManager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ eventId, pollId, submissionData }) => {
      try {
        const response = await AxiosWithToken.post(`/polls/event/${eventId}/${pollId}/submission`, submissionData);
        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response?.data?.message || error.message}`);
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["poll", variables.pollId]);
      queryClient.invalidateQueries(["poll-submissions", variables.pollId]);
      queryClient.invalidateQueries(["event-polls", variables.eventId]);
    },
  });
};

export default useCreatePollSubmissionManager;