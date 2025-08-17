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

interface Booth {
  _id: string;
  event: string;
  name: string;
  category: {
    _id: string;
    name: string;
  };
  price: number;
  description: string;
  size: string;
  location: string;
  quantity: number;
  currency: string;
  sale_start_date: string;
  sale_end_date: string;
  min_per_order: number;
  max_per_order: number;
  is_active: boolean;
  requires_approval: boolean;
  is_free: boolean;
  sold_out: boolean;
  quantity_remaining: number;
  sales_progress: number;
}

interface CreateBoothPayload {
  event: string;
  name: string;
  category: string;
  price: number;
  description: string;
  size: string;
  location: string;
  quantity: number;
  currency: string;
  sale_start_date: string;
  sale_end_date: string;
  min_per_order: number;
  max_per_order: number;
  is_active: boolean;
  requires_approval: boolean;
  is_free: boolean;
}

interface BuyBoothPayload {
  email: string;
  name: string;
  path: string;
  booths: Array<{
    boothId: string;
    quantity: number;
  }>;
  couponCode?: string;
}

interface BoothsResponse {
  status: string;
  message: string;
  data: Booth[];
}

export const CreateBoothCategoryManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(`/booths/category`, ["boothCategories"], true);

  const createBoothCategory = async (categoryData: { name: string }) => {
    try {
      await postCaller(categoryData);
    } catch (error) {
      console.error("Error creating booth category:", error);
    }
  };

  return {
    createBoothCategory,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const useGetBoothCategoriesManager = () => {
  return useQuery<BaseResponse, Error>(
    ["boothCategories"],
    async () => {
      const response = await AxiosWithToken.get(`/booths/category`);
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const CreateBoothManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(`/booths/`, ["eventBooths"], true);

  const createBooth = async (boothData: CreateBoothPayload) => {
    try {
      await postCaller(boothData);
    } catch (error) {
      console.error("Error creating booth:", error);
    }
  };

  return {
    createBooth,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const useGetEventBoothsManager = (eventId: string, enabled = true) => {
  return useQuery<BoothsResponse, Error>(
    ["eventBooths", eventId],
    async () => {
      const response = await AxiosWithToken.get(`/booths/event/${eventId}`);
      return response.data;
    },
    {
      enabled: enabled && !!eventId,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const UpdateBoothManager = ({ boothId }) => {
  const { updateCaller, isLoading, isSuccess, error, data } =
    useUpdateManager<BaseResponse>(
      `/booths/${boothId}`,
      ["eventBooths"],
      true
    );

  const updateBooth = async (boothData: Partial<CreateBoothPayload>) => {
    try {
      await updateCaller(boothData);
    } catch (error) {
      console.error("Error updating booth:", error);
    }
  };

  return {
    updateBooth,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const DeleteBoothManager = ({ boothId }) => {
  const { deleteCaller, isLoading, isSuccess, error, data } =
    useDeleteManager<BaseResponse>(
      `/booths/${boothId}`,
      ["eventBooths"],
      true
    );

  const deleteBooth = async () => {
    try {
      await deleteCaller(undefined);
    } catch (error) {
      console.error("Error deleting booth:", error);
    }
  };

  return {
    deleteBooth,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const BuyBoothManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(`/booths/event/buy`, ["booths"], true);

  const buyBooth = async (eventId: string, buyData: BuyBoothPayload) => {
    try {
      const endpoint = `/booths/event/${eventId}/buy`;
      await postCaller(buyData, endpoint);
    } catch (error) {
      console.error("Error buying booth:", error);
    }
  };

  return {
    buyBooth,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const BuyBoothMobileManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(
      `/booths/event/buy/mobile`,
      ["booths"],
      true
    );

  const buyBoothMobile = async (
    eventId: string,
    buyData: BuyBoothPayload
  ) => {
    try {
      const endpoint = `/booths/event/${eventId}/buy/mobile`;
      await postCaller(buyData, endpoint);
    } catch (error) {
      console.error("Error buying booth mobile:", error);
    }
  };

  return {
    buyBoothMobile,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

// Get Customer Events (all events customer has booths for)
export const useGetCustomerBoothEventsManager = (email: string) => {
  return useQuery<BaseResponse, Error>(
    ["customerBoothEvents", email],
    async () => {
      const response = await AxiosWithToken.get(`/booths/events`, {
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

// Request Edit Code for Booth
export const RequestBoothEditCodeManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(`/booths/request-edit-code`, ["boothEditCode"], true);

  const requestEditCode = async (email: string, eventId: string) => {
    try {
      await postCaller({ email, eventId });
    } catch (error) {
      console.error("Error requesting booth edit code:", error);
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

// Edit Booth Details
export const EditBoothDetailsManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(`/booths/edit-details`, ["customerBooths"], true);

  const editBoothDetails = async (editData: {
    email: string;
    eventId: string;
    code: string;
    booths: Array<{
      boothId: string;
      name?: string;
      phone?: string;
      company_name?: string;
      company?: string;
      email?: string;
      website?: string;
      industry?: string;
      description?: string;
      logo?: string;
      cover_banner?: string;
      brochure?: string;
      video?: string;
      address?: string;
      facebook?: string;
      twitter?: string;
      linkedin?: string;
      instagram?: string;
      services?: Array<{
        name: string;
        description?: string;
        image?: string;
        link?: string;
      }>;
      products?: Array<{
        name: string;
        description?: string;
        image?: string;
        link?: string;
        price?: string;
      }>;
      additionalInfo?: string;
    }>;
  }) => {
    try {
      await postCaller(editData);
    } catch (error) {
      console.error("Error editing booth details:", error);
    }
  };

  return {
    editBoothDetails,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const useGetCustomerBoothsManager = (email: string) => {
  return useQuery<BaseResponse, Error>(
    ["customerBooths", email],
    async () => {
      const response = await AxiosWithToken.get(`/booths/events`, {
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

export const useGetCustomerBoothsForEventManager = (email: string, eventId: string) => {
  return useQuery<BaseResponse, Error>(
    ["customerBoothsForEvent", email, eventId],
    async () => {
      const response = await AxiosWithToken.get(`/booths/purchases`, {
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

// Get Active Booths for Event Display (all purchased booths for this event)
export const useGetActiveBoothsForEventManager = (eventId: string) => {
  return useQuery<BaseResponse, Error>(
    ["activeBooths", eventId],
    async () => {
      const response = await AxiosWithToken.get(`/booths/active/event/${eventId}`);
      return response.data;
    },
    {
      enabled: !!eventId,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
};

// Get Detailed Booth Information
export const useGetBoothDetailsManager = (boothId: string) => {
  return useQuery<BaseResponse, Error>(
    ["boothDetails", boothId],
    async () => {
      const response = await AxiosWithToken.get(`/booths/details/${boothId}`);
      return response.data;
    },
    {
      enabled: !!boothId,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
};