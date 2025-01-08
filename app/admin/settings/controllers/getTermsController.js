import { useQuery } from "react-query";
import Axios from "@/constants/api_management/MyHttpHelper";

const useGetTermsManager = ({ type }) => {
  return useQuery({
    queryKey: ["terms", type],
    queryFn: async () => {
      try {
        const response = await Axios.get(`/terms/${type}`);
        return response.data;
      } catch (error) {
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    enabled: Boolean(type),
    refetchOnWindowFocus: false,
  });
};

export default useGetTermsManager;
