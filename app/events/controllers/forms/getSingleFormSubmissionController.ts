import Axios from "@/constants/api_management/MyHttpHelper";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQuery } from "react-query";

interface BaseResponse {
  status: string;
  message: string;
  data: any;
}

interface GetSingleFormSubmissionParams {
  formId: string;
  submissionId: string;
  enabled?: boolean;
}

export const GetSingleFormSubmissionManager = ({
  formId,
  submissionId,
  enabled = true,
}: GetSingleFormSubmissionParams) => {
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["form-submission", formId, submissionId],
    queryFn: async (): Promise<BaseResponse> => {
      try {
        const response = await Axios.get(
          `/event/forms/${formId}/submissions/${submissionId}`
        );
        return response.data;
      } catch (error: any) {
        console.error("Error fetching single form submission:", error);
        throw new Error(
          `Sorry: ${error.response?.data?.message || error.message}`
        );
      }
    },
    enabled: enabled && !!formId && !!submissionId,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export default GetSingleFormSubmissionManager;
