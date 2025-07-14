import Axios from "@/constants/api_management/MyHttpHelper";
import { useQuery } from "react-query";

interface BaseResponse {
  status: string;
  message: string;
  data: any;
}

interface FormMetadata {
  id: string;
  name: string;
  isRequired: boolean;
  isActive: boolean;
}

interface EventFormsMetadataResponse {
  hasRequiredForms: boolean;
  requiredForms: FormMetadata[];
  allActiveForms: FormMetadata[];
}

interface GetEventFormsMetadataParams {
  eventId: string;
  enabled?: boolean;
}

export const GetEventFormsMetadataManager = ({
  eventId,
  enabled = true,
}: GetEventFormsMetadataParams) => {
  const { data, isLoading, isSuccess, error } = useQuery({
    queryKey: ["event-forms-metadata", eventId],
    queryFn: async (): Promise<BaseResponse> => {
      try {
        // Use Next.js API route instead of direct backend call
        const response = await fetch(`/api/events/${eventId}/forms-metadata`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch forms metadata');
        }
        const data = await response.json();
        return data;
      } catch (error: any) {
        console.error("Error fetching event forms metadata:", error);
        throw new Error(
          `Sorry: ${error.message || 'Failed to fetch forms metadata'}`
        );
      }
    },
    enabled: enabled && !!eventId,
    refetchOnWindowFocus: false,
  });

  return {
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export default GetEventFormsMetadataManager;