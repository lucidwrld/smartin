import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { toast } from "react-toastify";

const useGetEventAccessCodesManager = ({ eventId }) => {
  return useQuery({
    queryKey: ["accessCodes", eventId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `/event/${eventId}/access-code`
        );
        return response.data;
      } catch (error) {
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    // enabled: Boolean(movieId),
    refetchOnWindowFocus: false,
  });
};

export default useGetEventAccessCodesManager;
