import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { TicketCategory, TicketCategoryResponse } from "../types";

// Create Ticket Category
export const CreateTicketCategoryManager = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: createCategory, isLoading, isSuccess, error, data } = useMutation<
    TicketCategoryResponse,
    Error,
    { name: string }
  >(
    async (categoryData) => {
      const response = await AxiosWithToken.post(`/ticket/category`, categoryData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["ticketCategories"]);
      },
    }
  );

  return { createCategory, isLoading, isSuccess, error, data };
};

// Get Ticket Categories
export const useGetTicketCategoriesManager = () => {
  return useQuery<TicketCategoryResponse, Error>(
    ["ticketCategories"],
    async () => {
      const response = await AxiosWithToken.get(`/ticket/category`);
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};