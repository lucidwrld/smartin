import usePostManager from "@/constants/controller_templates/post_controller_template";
import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import useDeleteManager from "@/constants/controller_templates/delete_controller_template";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQuery } from "react-query";
import { TicketCategory, TicketCategoryResponse } from "../types";

interface BaseResponse {
  status: string;
  message: string;
  data: any;
}

interface CreateTicketCategoryPayload {
  name: string;
}

export const CreateTicketCategoryManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(`/ticket/category`, ["ticketCategories"], true);

  const createCategory = async (categoryData: CreateTicketCategoryPayload) => {
    try {
      await postCaller(categoryData);
    } catch (error) {
      console.error("Error creating ticket category:", error);
    }
  };

  return {
    createCategory,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

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

export const UpdateTicketCategoryManager = () => {
  const { updateCaller, isLoading, isSuccess, error, data } =
    useUpdateManager<BaseResponse>(`/ticket/category`, ["ticketCategories"], true);

  const updateCategory = async (categoryId: string, categoryData: CreateTicketCategoryPayload) => {
    try {
      await updateCaller(categoryData);
    } catch (error) {
      console.error("Error updating ticket category:", error);
    }
  };

  return {
    updateCategory,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const DeleteTicketCategoryManager = () => {
  const { deleteCaller, isLoading, isSuccess, error, data } =
    useDeleteManager<BaseResponse>(
      `/ticket/category`,
      ["ticketCategories"],
      true
    );

  const deleteCategory = async (categoryId: string) => {
    try {
      const payload = {
        categoryId,
      };
      await deleteCaller(payload);
    } catch (error) {
      console.error("Error deleting ticket category:", error);
    }
  };

  return {
    deleteCategory,
    data,
    isLoading,
    isSuccess,
    error,
  };
};