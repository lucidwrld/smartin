import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQuery } from "react-query";

const useGetSinglePollManager = ({ pollId, enabled = true }) => {
  return useQuery({
    queryKey: ["poll", pollId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/polls/${pollId}`);
        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response?.data?.message || error.message}`);
      }
    },
    enabled: enabled && !!pollId,
    refetchOnWindowFocus: false,
  });
};

export default useGetSinglePollManager;