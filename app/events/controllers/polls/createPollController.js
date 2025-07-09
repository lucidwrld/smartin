import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useMutation, useQueryClient } from "react-query";

const useCreatePollManager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pollData) => {
      try {
        const response = await AxiosWithToken.post(`/polls`, pollData);
        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response?.data?.message || error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["event-polls"]);
    },
  });
};

export default useCreatePollManager;