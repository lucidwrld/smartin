import { useMutation, useQueryClient } from "react-query";

import { toast } from "react-toastify";
import AxiosWithToken from "../api_management/MyHttpHelperWithToken";
import Axios from "../api_management/MyHttpHelper";

const usePostManager = (endpoint, queryKey, isAuth = true) => {
  const queryClient = useQueryClient();
  const postController = async (details) => {
    try {
      const [response] = isAuth
        ? [await AxiosWithToken.post(endpoint, details)]
        : [await Axios.post(endpoint, details)];
      
      return response.data;
    } catch (error) { 
      throw new Error(`Sorry: ${error.response.data.message}`);
    }
  };

  const mutation = useMutation(postController, {
    onSuccess: async (data) => {
      // Update other caches using useQuery
      toast.success(data.message);
      const updateQueryKeys = [queryKey];
      if (updateQueryKeys.length) {
        updateQueryKeys.forEach((key) => queryClient.invalidateQueries(key));
      }
    },
    onError: (error) => {
      // Handle error if necessary
      toast.error(error.message);
      console.error("Post error:", error);
    },
  });

  const postCaller = async (details) => {
    try {
      await mutation.mutateAsync(details);
    } catch (error) {
      // Handle error if necessary
      console.error("Post error:", error);
    }
  };

  return {
    postCaller,
    data: mutation.data,
    isLoading: mutation.isLoading,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};

export default usePostManager;
