import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQuery } from "react-query";

const useGetSingleFormSubmissionManager = ({ formId, submissionId, enabled = true }) => {
  return useQuery({
    queryKey: ["form-submission", formId, submissionId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/event/forms/${formId}/submissions/${submissionId}`);
        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response?.data?.message || error.message}`);
      }
    },
    enabled: enabled && !!formId && !!submissionId,
    refetchOnWindowFocus: false,
  });
};

export default useGetSingleFormSubmissionManager;