import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQuery } from "react-query";

const useGetSingleFormManager = ({ formId, enabled = true }) => {
  return useQuery({
    queryKey: ["form", formId],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/event/forms/${formId}`);
        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response?.data?.message || error.message}`);
      }
    },
    enabled: enabled && !!formId,
    refetchOnWindowFocus: false,
  });
};

export default useGetSingleFormManager;