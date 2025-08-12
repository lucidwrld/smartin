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

interface BoothCoupon {
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
  applicable_booths: string[];
  apply_to_all_booths: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateBoothCouponPayload {
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
  applicable_booths?: string[];
  apply_to_all_booths: boolean;
}

interface ValidateCouponPayload {
  code: string;
  booths: Array<{
    boothId: string;
    quantity: number;
  }>;
}

interface CouponsResponse {
  status: string;
  message: string;
  data: BoothCoupon[];
}

export const CreateBoothCouponManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(`/booth-coupons`, ["boothCoupons"], true);

  const createCoupon = async (couponData: CreateBoothCouponPayload) => {
    try {
      await postCaller(couponData);
    } catch (error) {
      console.error("Error creating booth coupon:", error);
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

export const useGetEventBoothCouponsManager = (eventId: string, enabled = true) => {
  return useQuery<CouponsResponse, Error>(
    ["boothCoupons", eventId],
    async () => {
      const response = await AxiosWithToken.get(`/booth-coupons/event/${eventId}`);
      return response.data;
    },
    {
      enabled: enabled && !!eventId,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const UpdateBoothCouponManager = ({ couponId }) => {
  const { updateCaller, isLoading, isSuccess, error, data } =
    useUpdateManager<BaseResponse>(
      `/booth-coupons/${couponId}`,
      ["boothCoupons"],
      true
    );

  const updateCoupon = async (couponData: Partial<CreateBoothCouponPayload>) => {
    try {
      await updateCaller(couponData);
    } catch (error) {
      console.error("Error updating booth coupon:", error);
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

export const DeleteBoothCouponManager = ({ couponId }) => {
  const { deleteCaller, isLoading, isSuccess, error, data } =
    useDeleteManager<BaseResponse>(
      `/booth-coupons/${couponId}`,
      ["boothCoupons"],
      true
    );

  const deleteCoupon = async () => {
    try {
      await deleteCaller(undefined);
    } catch (error) {
      console.error("Error deleting booth coupon:", error);
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

export const ValidateBoothCouponManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager<BaseResponse>(`/booth-coupons/validate`, [], false);

  const validateCoupon = async (eventId: string, validationData: ValidateCouponPayload) => {
    try {
      const endpoint = `/booth-coupons/event/${eventId}/validate`;
      await postCaller(validationData, endpoint);
    } catch (error) {
      console.error("Error validating booth coupon:", error);
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