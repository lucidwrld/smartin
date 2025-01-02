import { toast } from "react-toastify";

import { useQuery } from "react-query";
import Axios from "@/constants/api_management/MyHttpHelper";
import { useRouter } from "next/navigation";

const useVerifyOtp = (enabled, otp, type) => {
  const router = useRouter();
  return useQuery({
    queryKey: ["verify-account", enabled, type],
    queryFn: async () => {
      try {
        const response = await Axios.get(
          `/auth/${type === "admin" ? "verify-admin" : "verify"}/${otp}`
        );

        if (type === "admin") {
          localStorage.setItem("admin-token", `${response.data?.data?.token}`);
          toast.success(response?.data?.message);
          router.push("/admin/dashboard");
        } else {
          localStorage.setItem("token", `${response.data?.data?.token}`);
          router.push("/dashboard");
        }
        return response.data;
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

export default useVerifyOtp;
