import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { toast } from "react-toastify";

const useGetSingleEventManager = ({ eventId, enabled }) => {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/event/${eventId}`);
        return response.data;
      } catch (error) {
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

export default useGetSingleEventManager;
