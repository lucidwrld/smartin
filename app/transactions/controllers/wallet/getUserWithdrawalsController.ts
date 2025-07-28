import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

export const useGetUserWithdrawalsManager = ({ page = 1, pageSize = 10, enabled = true }) => {
  return useQuery(
    ["user-withdrawals", page, pageSize],
    async () => {
      try {
        const response = await AxiosWithToken.get("/wallet/withdrawal", {
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