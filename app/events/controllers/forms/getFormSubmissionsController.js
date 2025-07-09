import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQuery } from "react-query";

const useGetFormSubmissionsManager = ({ 
  formId, 
  page = 1, 
  pageSize = 10,
  enabled = true 
}) => {
  return useQuery({
    queryKey: ["form-submissions", formId, page, pageSize],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/event/forms/${formId}/submissions`, {
          params: {
            page,
            pageSize,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response?.data?.message || error.message}`);
      }
    },
    enabled: enabled && !!formId,
    refetchOnWindowFocus: false,
  });
};

export default useGetFormSubmissionsManager;