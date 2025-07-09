import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useMutation, useQueryClient } from "react-query";

const useUpdateFormFieldsManager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ formId, fields }) => {
      try {
        const response = await AxiosWithToken.put(`/event/forms/${formId}`, fields);
        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response?.data?.message || error.message}`);
      }
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["form", variables.formId]);
      queryClient.invalidateQueries(["event-forms"]);
    },
  });
};

export default useUpdateFormFieldsManager;