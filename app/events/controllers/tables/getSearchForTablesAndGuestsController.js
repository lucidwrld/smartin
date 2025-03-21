import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import Axios from "@/constants/api_management/MyHttpHelper";

const useGetSearchForTablesAndGuestsManager = ({
  eventId,
  enabled,
  searchQuery,
  code,
}) => {
  const axiosInstance = code ? Axios : AxiosWithToken;

  return useQuery({
    queryKey: ["searches", eventId, searchQuery],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(
          `/event/${eventId}/tables/search?s=${searchQuery}${
            code && `&accessCode=${code}`
          }`
        );
        return response.data;
      } catch (error) {
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

export default useGetSearchForTablesAndGuestsManager;
