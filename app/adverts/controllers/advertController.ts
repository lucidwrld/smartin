import usePostManager from "@/constants/controller_templates/post_controller_template";
import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import useDeleteManager from "@/constants/controller_templates/delete_controller_template";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQuery } from "react-query";

interface BaseResponse {
  status: string;
  message: string;
  data: any;
}

interface Advert {
  _id: string;
  event: string;
  name: string;
  category: {
    _id: string;
    name: string;
  };
  price: number;
  description: string;
  format: string;
  dimensions: string;
  placement: string;
  duration: string;
  quantity: number;
  currency: string;
  sale_start_date: string;
  sale_end_date: string;
  min_per_order: number;
  max_per_order: number;
  is_active: boolean;
  requires_approval: boolean;
  is_free: boolean;
  is_virtual: boolean;
  sold_out: boolean;
  quantity_remaining: number;
  sales_progress: number;
}

interface CreateAdvertPayload {
  event: string;
  name: string;
  category: string;
  price: number;
  description: string;
  format: string;
  dimensions: string;
  placement: string;
  duration: string;
  quantity: number;
  currency: string;
  sale_start_date: string;
  sale_end_date: string;
  min_per_order: number;
  max_per_order: number;
  is_active: boolean;
  requires_approval: boolean;
  is_free: boolean;
  is_virtual?: boolean;
}

interface BuyAdvertPayload {
  email: string;
  name: string;
  path: string;
  adverts: Array<{
    advertId: string;
    quantity: number;
    content_url?: string;
    preview_image_url?: string;
  }>;
  couponCode?: string;
}

interface AdvertsResponse {
  status: string;
  message: string;
  data: Advert[];
}

export const CreateAdvertCategoryManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(`/advert-management/category`, ["advertCategories"], true);

  const createAdvertCategory = async (categoryData: { name: string }) => {
    try {
      await postCaller(categoryData);
    } catch (error) {
      console.error("Error creating advert category:", error);
    }
  };

  return {
    createAdvertCategory,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const useGetAdvertCategoriesManager = () => {
  return useQuery<BaseResponse, Error>(
    ["advertCategories"],
    async () => {
      const response = await AxiosWithToken.get(`/advert-management/category`);
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const CreateAdvertManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(`/advert-management/`, ["eventAdverts"], true);

  const createAdvert = async (advertData: CreateAdvertPayload) => {
    try {
      await postCaller(advertData);
    } catch (error) {
      console.error("Error creating advert:", error);
    }
  };

  return {
    createAdvert,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const useGetEventAdvertsManager = (eventId: string, enabled = true) => {
  return useQuery<AdvertsResponse, Error>(
    ["eventAdverts", eventId],
    async () => {
      const response = await AxiosWithToken.get(`/advert-management/event/${eventId}`);
      return response.data;
    },
    {
      enabled: enabled && !!eventId,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const UpdateAdvertManager = ({ advertId }) => {
  const { updateCaller, isLoading, isSuccess, error, data } =
    useUpdateManager<BaseResponse>(
      `/advert-management/${advertId}`,
      ["eventAdverts"],
      true
    );

  const updateAdvert = async (advertData: Partial<CreateAdvertPayload>) => {
    try {
      await updateCaller(advertData);
    } catch (error) {
      console.error("Error updating advert:", error);
    }
  };

  return {
    updateAdvert,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const DeleteAdvertManager = ({ advertId }) => {
  const { deleteCaller, isLoading, isSuccess, error, data } =
    useDeleteManager<BaseResponse>(
      `/advert-management/${advertId}`,
      ["eventAdverts"],
      true
    );

  const deleteAdvert = async () => {
    try {
      await deleteCaller(undefined);
    } catch (error) {
      console.error("Error deleting advert:", error);
    }
  };

  return {
    deleteAdvert,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const BuyAdvertManager = ({eventId}) => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(`/advert-management/event/${eventId}/buy`, ["adverts"], true);

  const buyAdvert = async ( buyData: BuyAdvertPayload) => {
    try { 
      await postCaller(buyData, );
    } catch (error) {
      console.error("Error buying advert:", error);
    }
  };

  return {
    buyAdvert,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const BuyAdvertMobileManager = ({eventId}) => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(
      `/advert-management/event/${eventId}/buy/mobile`,
      ["adverts"],
      true
    );

  const buyAdvertMobile = async ( 
    buyData: BuyAdvertPayload
  ) => {
    console.log(eventId)
    try {
      
      await postCaller(buyData);
    } catch (error) {
      console.error("Error buying advert mobile:", error);
    }
  };

  return {
    buyAdvertMobile,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

// Get Customer Events (all events customer has adverts for)
export const useGetCustomerAdvertEventsManager = (email: string) => {
  return useQuery<BaseResponse, Error>(
    ["customerAdvertEvents", email],
    async () => {
      const response = await AxiosWithToken.get(`/advert-management/events`, {
        params: { email }
      });
      return response.data;
    },
    {
      enabled: !!email,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
};

// Request Edit Code for Advert
export const RequestAdvertEditCodeManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(`/advert-management/request-edit-code`, ["advertEditCode"], true);

  const requestEditCode = async (email: string, eventId: string) => {
    try {
      await postCaller({ email, eventId });
    } catch (error) {
      console.error("Error requesting advert edit code:", error);
    }
  };

  return {
    requestEditCode,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

// Edit Advert Details
export const EditAdvertDetailsManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(`/advert-management/edit-details`, ["customerAdverts"], true);

  const editAdvertDetails = async (editData: {
    email: string;
    eventId: string;
    code: string;
    adverts: Array<{
      advertId: string;
      name?: string;
      phone?: string;
      company?: string;
      content_url?: string;
      preview_image_url?: string;
      additionalInfo?: string;
    }>;
  }) => {
    try {
      await postCaller(editData);
    } catch (error) {
      console.error("Error editing advert details:", error);
    }
  };

  return {
    editAdvertDetails,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const useGetCustomerAdvertsManager = (email: string) => {
  return useQuery<BaseResponse, Error>(
    ["customerAdverts", email],
    async () => {
      const response = await AxiosWithToken.get(`/advert-management/events`, {
        params: { email }
      });
      return response.data;
    },
    {
      enabled: !!email,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useGetCustomerAdvertsForEventManager = (email: string, eventId: string) => {
  return useQuery<BaseResponse, Error>(
    ["customerAdvertsForEvent", email, eventId],
    async () => {
      const response = await AxiosWithToken.get(`/advert-management/purchases`, {
        params: { email, eventId }
      });
      return response.data;
    },
    {
      enabled: !!email && !!eventId,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
};

// Get Active Adverts for Event Display (all purchased ads for this event)
export const useGetActiveAdvertsForEventManager = (eventId: string) => {
  return useQuery<BaseResponse, Error>(
    ["activeAdverts", eventId],
    async () => {
      const response = await AxiosWithToken.get(`/advert-management/active/event/${eventId}`);
      return response.data;
    },
    {
      enabled: !!eventId,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
};