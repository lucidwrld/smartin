import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { toast } from "react-toastify";

const useGetMembersManager = ({ eventId }) => {
  return useQuery({
    queryKey: ["members", eventId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/event/${eventId}/members`);
        return response.data;
      } catch (error) {
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    // enabled: Boolean(movieId),
    refetchOnWindowFocus: false,
  });
};

export default useGetMembersManager;
