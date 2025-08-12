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

interface AdvertCoupon {
  _id: string;
  event: string;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_purchase?: number;
  max_discount?: number;
  usage_limit?: number;
  usage_count: number;
  is_active: boolean;
  valid_from: string;
  valid_until: string;
  applicable_adverts: string[];
  apply_to_all_adverts: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateAdvertCouponPayload {
  event: string;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_purchase?: number;
  max_discount?: number;
  usage_limit?: number;
  is_active: boolean;
  valid_from: string;
  valid_until: string;
  applicable_adverts?: string[];
  apply_to_all_adverts: boolean;
}

interface ValidateCouponPayload {
  code: string;
  adverts: Array<{
    advertId: string;
    quantity: number;
  }>;
}

interface CouponsResponse {
  status: string;
  message: string;
  data: AdvertCoupon[];
}

export const CreateAdvertCouponManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(`/advert-coupons`, ["advertCoupons"], true);

  const createCoupon = async (couponData: CreateAdvertCouponPayload) => {
    try {
      await postCaller(couponData);
    } catch (error) {
      console.error("Error creating advert coupon:", error);
    }
  };

  return {
    createCoupon,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const useGetEventAdvertCouponsManager = (eventId: string, enabled = true) => {
  return useQuery<CouponsResponse, Error>(
    ["advertCoupons", eventId],
    async () => {
      const response = await AxiosWithToken.get(`/advert-coupons/event/${eventId}`);
      return response.data;
    },
    {
      enabled: enabled && !!eventId,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const UpdateAdvertCouponManager = ({ couponId }) => {
  const { updateCaller, isLoading, isSuccess, error, data } =
    useUpdateManager<BaseResponse>(
      `/advert-coupons/${couponId}`,
      ["advertCoupons"],
      true
    );

  const updateCoupon = async (couponData: Partial<CreateAdvertCouponPayload>) => {
    try {
      await updateCaller(couponData);
    } catch (error) {
      console.error("Error updating advert coupon:", error);
    }
  };

  return {
    updateCoupon,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const DeleteAdvertCouponManager = ({ couponId }) => {
  const { deleteCaller, isLoading, isSuccess, error, data } =
    useDeleteManager<BaseResponse>(
      `/advert-coupons/${couponId}`,
      ["advertCoupons"],
      true
    );

  const deleteCoupon = async () => {
    try {
      await deleteCaller(undefined);
    } catch (error) {
      console.error("Error deleting advert coupon:", error);
    }
  };

  return {
    deleteCoupon,
    data,
    isLoading,
    isSuccess,
    error,
  };
};

export const ValidateAdvertCouponManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(`/advert-coupons/validate`, [], false);

  const validateCoupon = async (eventId: string, validationData: ValidateCouponPayload) => {
    try {
      const endpoint = `/advert-coupons/event/${eventId}/validate`;
      await postCaller(validationData, endpoint);
    } catch (error) {
      console.error("Error validating advert coupon:", error);
    }
  };

  return {
    validateCoupon,
    data,
    isLoading,
    isSuccess,
    error,
  };
};