import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQuery } from "react-query";

const useGetUserSubscriptionsManager = ({
  enabled = true,
}) => {
  return useQuery(
    ["user-subscriptions", enabled],
    async () => {
      try {
        const [response] = [
          await AxiosWithToken.get(`/subscription`),
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

export default useGetUserSubscriptionsManager;