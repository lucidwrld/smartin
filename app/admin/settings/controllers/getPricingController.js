import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { toast } from "react-toastify";

const useGetPricingsManager = () => {
  return useQuery({
    queryKey: ["pricing"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/pricing/`);
        return response.data;
      } catch (error) {
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    // enabled: Boolean(movieId),
    refetchOnWindowFocus: false,
  });
};

export default useGetPricingsManager;
