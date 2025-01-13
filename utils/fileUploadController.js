import { useMutation } from "react-query";

import { useState } from "react";

import axios from "axios";
import Axios from "@/constants/api_management/MyHttpHelper";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

const useFileUpload = () => {
  const [progress, setProgress] = useState(0);
  const uploadFile = async (file) => {
    const fileName = file.name;
    const fileType = file.type;

    // Step 1: Get signed request and URL
    try {
      const [response] = [
        await Axios.post(
          `/services/file/presign-url?file_name=${fileName}&file_type=${fileType}`
        ),
      ];

      const config = {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      };

      await axios.put(response.data.data.signedRequest, file, config);

      return response.data.data;
    } catch (error) {
      throw new Error(`Sorry: ${error}`);
    }
  };

  const mutation = useMutation({
    mutationFn: uploadFile,
    onError: (error) => {},
    onSuccess: (data) => {
      return data;
    },
  });

  const handleFileUpload = async (file) => {
    // let url;
    try {
      const respondins = await mutation.mutateAsync(file);
      return respondins.url;
    } catch (error) {}
    // return url;
  };

  return {
    progress,
    handleFileUpload,
    data: mutation.data,
    isLoading: mutation.isLoading,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};

export default useFileUpload;
