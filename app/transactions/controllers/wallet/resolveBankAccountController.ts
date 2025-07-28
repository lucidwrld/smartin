import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

export const useResolveBankAccountManager = (accountNumber: string, bankCode: string) => {
  return useQuery(
    ["resolve-bank-account", accountNumber, bankCode],
    async () => {
      try {
        const response = await AxiosWithToken.get("/wallet/bank/resolve", {
          params: {
            account_number: accountNumber,
            bank_code: bankCode
          }
        });
        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response?.data?.message || error.message}`);
      }
    },
    {
      enabled: Boolean(accountNumber && bankCode && accountNumber.length >= 10),
      refetchOnWindowFocus: false,
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );
};