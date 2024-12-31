import { useQuery } from "react-query";
import Axios from "@/constants/api_management/MyHttpHelper";

const useGetInviteByCodeManager = ({ code }) => {
  return useQuery({
    queryKey: ["invite", code],
    queryFn: async () => {
      try {
        const response = await Axios.get(`/event/invites/${code}`);
        return response.data;
      } catch (error) {
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    // enabled: Boolean(movieId),
    refetchOnWindowFocus: false,
  });
};

export default useGetInviteByCodeManager;
