import Axios from "@/constants/api_management/MyHttpHelper";
import { useQuery } from "react-query";

interface BaseResponse {
  status: string;
  message: string;
  data: any;
}

interface GetPublicFormParams {
  formId: string;
  enabled?: boolean;
}

export const GetPublicFormManager = ({
  formId,
  enabled = true,
}: GetPublicFormParams) => {
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["public-form", formId],
    queryFn: async (): Promise<BaseResponse> => {
      try {
        // Use Next.js API route instead of direct backend call
        const response = await fetch(`/api/forms/${formId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch form');
        }
        const data = await response.json();
        return data;
      } catch (error: any) {
        console.error("Error fetching public form:", error);
        throw new Error(
          `Sorry: ${error.message || 'Failed to fetch form'}`
        );
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

export default GetPublicFormManager;