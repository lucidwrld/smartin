import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQuery } from "react-query";

const useGetUserCreditsManager = ({ enabled = true }) => {
  return useQuery(
    ["user-credits", enabled],
    async () => {
      try {
        const [response] = [await AxiosWithToken.get("/credit-management/balance")];
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

export default useGetUserCreditsManager;