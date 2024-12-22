import { useMutation, useQueryClient } from "react-query";

import { toast } from "react-toastify";
import AxiosWithToken from "../api_management/MyHttpHelperWithToken";
import Axios from "../api_management/MyHttpHelper";

const useUpdateManager = (
  endpoint,
  queryKey,
  isMulti = false,
  isAuth = true,
  showSuccessToast = true
) => {
  const queryClient = useQueryClient();

  const updateController = async (data) => {
    try {
      const [response] = isAuth
        ? [await AxiosWithToken.put(endpoint, data)]
        : [await Axios.put(endpoint, data)];
       
      return response.data;
    } catch (error) { 
      throw new Error(`Sorry: ${error.response.data.message}`);
    }
  };

  const mutation = useMutation(updateController, {
    onSuccess: async (data) => {
      // Update other caches using useQuery
      {
        showSuccessToast && toast.success(data.message);
      }
      const updateQueryKeys = isMulti ? queryKey : [queryKey];
      if (updateQueryKeys.length) {
        updateQueryKeys.forEach((key) => queryClient.invalidateQueries(key));
      }
    },
    onError: (error) => {
      toast.error(error.message);
      // Handle error if necessary
      console.error("Update error:", error);
    },
  });

  const updateCaller = async (details) => {
    try {
      await mutation.mutateAsync(details);
    } catch (error) {
      // Handle error if necessary
      console.error("Update error:", error);
    }
  };

  return {
    updateCaller,
    data: mutation.data,
    isLoading: mutation.isLoading,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};

export default useUpdateManager;
