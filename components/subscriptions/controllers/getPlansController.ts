import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQuery } from "react-query";

const useGetPlansManager = ({
  currency = "",
  enabled = true,
}) => {
  return useQuery(
    ["subscription-plans", currency, enabled],
    async () => {
      try {
        const [response] = [
          await AxiosWithToken.get(`/subscription/plan/list`, {
            params: {
              ...(currency && { currency }),
            },
          }),
        ];

        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response.data.message}`);
      }
    },
    {
      enabled,
      refetchOnWindowFocus: false,
    }
  );
};

export default useGetPlansManager;