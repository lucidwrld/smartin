import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQuery } from "react-query";

interface BaseResponse {
  status: string;
  message: string;
  data: any;
}

interface GetSingleFormParams {
  formId: string;
  enabled?: boolean;
}

export const GetSingleFormManager = ({ formId, enabled = true }: GetSingleFormParams) => {
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["form", formId],
    queryFn: async (): Promise<BaseResponse> => {
      try {
        const response = await AxiosWithToken.get(`/event/forms/${formId}`);
        return response.data;
      } catch (error: any) {
        console.error("Error fetching single form:", error);
        throw new Error(`Sorry: ${error.response?.data?.message || error.message}`);
      }
    },
    enabled: enabled && !!formId,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export default GetSingleFormManager;