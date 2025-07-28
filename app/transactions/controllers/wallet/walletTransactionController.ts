import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

export const useGetWalletTransactionsManager = ({ page = 1, pageSize = 10, enabled = true }) => {
  return useQuery(
    ["wallet-transactions", page, pageSize],
    async () => {
      try {
        const response = await AxiosWithToken.get("/api/v1/wallet/transactions", {
          params: {
            page,
            pageSize
          }
        });
        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response?.data?.message || error.message}`);
      }
    },
    {
      enabled,
      refetchOnWindowFocus: false,
    }
  );
};