import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

const useGetPartnerDiscountsManager = () => {
  return useQuery({
    queryKey: ["partnerDiscounts"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/user/partners/discount`);
        return response.data;
      } catch (error) {
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export default useGetPartnerDiscountsManager;