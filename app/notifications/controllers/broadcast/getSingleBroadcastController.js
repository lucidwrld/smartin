import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { toast } from "react-toastify";

const useGetSingleBroadcastManager = ({ id = "", enabled = true }) => {
  return useQuery({
    queryKey: ["broadcast", id],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `/notification/broadcast/${id}`
        );
        return response.data;
      } catch (error) { 
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

export default useGetSingleBroadcastManager;
