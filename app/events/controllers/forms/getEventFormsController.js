import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQuery } from "react-query";

const useGetEventFormsManager = ({ eventId, enabled = true }) => {
  return useQuery({
    queryKey: ["event-forms", eventId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/event/${eventId}/forms`);
        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response?.data?.message || error.message}`);
      }
    },
    enabled: enabled && !!eventId,
    refetchOnWindowFocus: false,
  });
};

export default useGetEventFormsManager;