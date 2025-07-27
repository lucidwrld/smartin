import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

export const useGetCreditPricingManager = () => {
  return useQuery(["credit-pricing"], async () => {
    try {
      const [response] = [await AxiosWithToken.get("/pricing/credits")];
      return response.data;
    } catch (error) {
      throw new Error(`Sorry: ${error.response.data.message}`);
    }
  }, {
    refetchOnWindowFocus: false,
  });
};