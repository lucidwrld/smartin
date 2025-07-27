import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

export const useGetPriceForChannelManager = (type: string, channel: string, currency: string) => {
  return useQuery(
    ["credit-pricing-channel", type, channel, currency],
    async () => {
      try {
        const [response] = [await AxiosWithToken.get(`/pricing/credits/channel/${type}/${channel}/${currency}`)];
        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response.data.message}`);
      }
    },
    {
      enabled: !!type && !!channel && !!currency,
      refetchOnWindowFocus: false,
    }
  );
};