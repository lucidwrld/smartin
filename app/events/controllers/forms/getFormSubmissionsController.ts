import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQuery } from "react-query";

interface BaseResponse {
  status: string;
  message: string;
  data: any;
}

interface GetFormSubmissionsParams {
  formId: string;
  eventId: string;
  page?: number;
  pageSize?: number;
  search?: string;
  enabled?: boolean;
}

export const GetFormSubmissionsManager = ({
  formId,
  eventId,
  page = 1,
  pageSize = 10,
  search = "",
  enabled = true,
}: GetFormSubmissionsParams) => {
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["form-submissions", formId, page, pageSize, search],
    queryFn: async (): Promise<BaseResponse> => {
      try {
        const response = await AxiosWithToken.get(
          `/event/${eventId}/forms/${formId}/submissions`,
          {
            params: {
              page,
              pageSize,
              ...(search && { search }),
            },
          }
        );
        return response.data;
      } catch (error: any) {
        console.error("Error fetching form submissions:", error);
        throw new Error(
          `Sorry: ${error.response?.data?.message || error.message}`
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

export default GetFormSubmissionsManager;
