import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

import { useQuery } from "react-query";

const useGetUserDetailsManager = (enabled = true) => {
  return useQuery(
    ["userDetails", enabled],
    async () => {
      try {
        const [response] = [await AxiosWithToken.get(`/user`)];

        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response.data.message}`);
      }
    },
    {
      enabled,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      cacheTime: Infinity,
      // Optionally add retry config
      retry: 2,
      retryDelay: 1000,
    }
  );
};

export default useGetUserDetailsManager;
