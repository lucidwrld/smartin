import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useMutation, useQueryClient } from "react-query";

const useCreateFormManager = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData) => {
      try {
        const response = await AxiosWithToken.post(`/event/form`, formData);
        return response.data;
      } catch (error) {
        throw new Error(`Sorry: ${error.response?.data?.message || error.message}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["event-forms"]);
    },
  });
};

export default useCreateFormManager;