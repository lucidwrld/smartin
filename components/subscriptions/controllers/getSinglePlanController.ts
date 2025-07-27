import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQuery } from "react-query";

const useGetSinglePlanManager = ({
  planId,
  enabled = true,
}) => {
  return useQuery(
    ["subscription-plan", planId, enabled],
    async () => {
      try {
        const [response] = [
          await AxiosWithToken.get(`/subscription/plan/${planId}`),
        ];

        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response.data.message}`);
      }
    },
    {
      enabled: enabled && !!planId,
      refetchOnWindowFocus: false,
    }
  );
};

export default useGetSinglePlanManager;