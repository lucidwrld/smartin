import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

const useGetSingleTableManager = ({ eventId, enabled, tableId }) => {
  return useQuery({
    queryKey: ["table", eventId, tableId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `/event/${eventId}/tables/${tableId}`
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

export default useGetSingleTableManager;
