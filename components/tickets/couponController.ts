import usePostManager from "@/constants/controller_templates/post_controller_template";
import useUpdateManager from "@/constants/controller_templates/put_controller_template";
import useDeleteManager from "@/constants/controller_templates/delete_controller_template";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { useQuery } from "react-query";

interface CouponData {
  event: string;
  code: string;
  name: string;
  description?: string;
  type: "percentage" | "fixed";
  value: number;
  min_purchase?: number;
  max_discount?: number;
  usage_limit?: number;
  is_active: boolean;
  valid_from: string;
  valid_until: string;
  applicable_tickets: string[];
  apply_to_all_tickets: boolean;
}

interface ValidateCouponData {
  code: string;
  ticket_items: {
    ticket_id: string;
    quantity: number;
  }[];
}

interface CouponResponse {
  status: string;
  message: string;
  data: {
    coupons: any[];
    pagination: any;
    statistics: {
      total_coupons: number;
      active_coupons: number;
      total_usage: number;
      total_savings: number;
    };
  };
}

interface SingleCouponResponse {
  status: string;
  message: string;
  data: any;
}

interface ValidateCouponResponse {
  status: string;
  message: string;
  data: {
    coupon: {
      id: string;
      code: string;
      name: string;
      type: string;
      value: number;
    };
    discount_amount: number;
    original_amount: number;
    final_amount: number;
    savings: number;
  };
}

export const CreateCouponManager = () => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager(`/coupons`, ["coupons"], true);

  const createCoupon = async (couponData: CouponData) => {
    try {
      await postCaller(couponData);
    } catch (error) {
      console.error("Error creating coupon:", error);
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

export const useGetEventCouponsManager = (eventId: string, enabled = true) => {
  return useQuery<CouponResponse, Error>(
    ["coupons", eventId],
    async () => {
      const response = await AxiosWithToken.get(`/coupons/event/${eventId}`);
      return response.data;
    },
    {
      enabled: enabled && !!eventId,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const useGetCouponByIdManager = (couponId: string, enabled = true) => {
  return useQuery<SingleCouponResponse, Error>(
    ["coupon", couponId],
    async () => {
      const response = await AxiosWithToken.get(`/coupons/${couponId}`);
      return response.data;
    },
    {
      enabled: enabled && !!couponId,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );
};

export const UpdateCouponManager = ({ couponId }: { couponId: string }) => {
  const { updateCaller, isLoading, isSuccess, error, data } =
    useUpdateManager(
      `/coupons/${couponId}`,
      ["coupons"],
      true
    );

  const updateCoupon = async (couponData: Partial<CouponData>) => {
    try {
      await updateCaller(couponData);
    } catch (error) {
      console.error("Error updating coupon:", error);
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

export const DeleteCouponManager = ({ couponId }: { couponId: string }) => {
  const { deleteCaller, isLoading, isSuccess, error, data } =
    useDeleteManager(
      `/coupons/${couponId}`,
      ["coupons"],
      true
    );

  const deleteCoupon = async () => {
    try {
      await deleteCaller(undefined);
    } catch (error) {
      console.error("Error deleting coupon:", error);
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

export const ValidateCouponManager = ({ eventId }: { eventId: string }) => {
  const { postCaller, isLoading, isSuccess, error, data } =
    usePostManager(
      `/coupons/event/${eventId}/validate`,
      ["coupons"],
      false
    );

  const validateCoupon = async (validationData: ValidateCouponData) => {
    try {
      await postCaller(validationData);
    } catch (error) {
      console.error("Error validating coupon:", error);
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