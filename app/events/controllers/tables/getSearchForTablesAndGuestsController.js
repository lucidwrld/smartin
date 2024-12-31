import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

const useGetSearchForTablesAndGuestsManager = ({
  eventId,
  enabled,
  searchQuery,
}) => {
  return useQuery({
    queryKey: ["searches", eventId, searchQuery],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `/event/${eventId}/tables/search?s=${searchQuery}`
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
