import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { toast } from "react-toastify";

const useGetTermsManager = ({ type }) => {
  return useQuery({
    queryKey: ["terms", type],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/terms/${type}`);
        return response.data;
      } catch (error) {
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    enabled: false,
    refetchOnWindowFocus: false,
  });
};

export default useGetTermsManager;
