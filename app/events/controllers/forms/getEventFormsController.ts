import Axios from "@/constants/api_management/MyHttpHelper";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQuery } from "react-query";

interface BaseResponse {
  status: string;
  message: string;
  data: any;
}

interface GetEventFormsParams {
  eventId: string;
  enabled?: boolean;
}

export const GetEventFormsManager = ({
  eventId,
  enabled = true,
}: GetEventFormsParams) => {
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["event-forms", eventId],
    queryFn: async (): Promise<BaseResponse> => {
      try {
        const response = await Axios.get(`/event/${eventId}/forms`);
        return response.data;
      } catch (error: any) {
        console.error("Error fetching event forms:", error);
        throw new Error(
          `Sorry: ${error.response?.data?.message || error.message}`
        );
      }
    },
    enabled: enabled && !!eventId,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export default GetEventFormsManager;
