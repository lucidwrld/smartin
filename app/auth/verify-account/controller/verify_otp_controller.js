import { toast } from "react-toastify";

import { useQuery } from "react-query";
import Axios from "@/constants/api_management/MyHttpHelper";
import { useRouter } from "next/navigation";

const useVerifyOtp = (enabled, otp, accountType, type, organization) => {
  const router = useRouter();
  return useQuery({
    queryKey: ["verify-account", enabled, type, organization],
    queryFn: async () => {
      try { 
        const response = await Axios.get(`/auth/${type === "admin" ? "verify-admin" : "verify"}/${otp}`);

        if (type === "admin") {
          localStorage.setItem("confidant-admin-token", `${response.data?.data?.token}`);
          toast.success(response?.data?.message);
          router.push("/admin/dashboard");
        } else {
          localStorage.setItem("token", `Bearer ${response.data?.data?.authorization?.token}`);
          router.push(accountType === "Consultant" ? "/auth/consultant-application" : organization ? "/groups" : "/")
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
