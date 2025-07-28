import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

export const useGetUserBalanceManager = ({ enabled = true }) => {
  return useQuery(
    ["user-balance"],
    async () => {
      try {
        const response = await AxiosWithToken.get("/wallet/balance");
        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response?.data?.message || error.message}`);
      }
    },
    {
      enabled,
      refetchOnWindowFocus: false,
      staleTime: 30 * 1000, // 30 seconds
    }
  );
};