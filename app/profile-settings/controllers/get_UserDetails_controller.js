import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

import { useQuery } from "react-query";

const useGetUserDetailsManager = (enabled = true) => {
  return useQuery(
    ["userDetails", enabled],
    async () => {
      try {
        const [response] = [await AxiosWithToken.get(`/users/single`)];

        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response.data.message}`);
      }
    },
    {
      enabled: enabled,
      refetchOnWindowFocus: false,
    }
  );
};

export default useGetUserDetailsManager;
