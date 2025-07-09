import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useMutation, useQueryClient } from "react-query";

const useUpdatePollManager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ pollId, pollData }) => {
      try {
        const response = await AxiosWithToken.put(`/polls/${pollId}`, pollData);
        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response?.data?.message || error.message}`);
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["poll", variables.pollId]);
      queryClient.invalidateQueries(["event-polls"]);
    },
  });
};

export default useUpdatePollManager;