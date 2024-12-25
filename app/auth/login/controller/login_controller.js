import Axios from "@/constants/api_management/MyHttpHelper";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "react-query";

import { toast } from "react-toastify";

const useLoginManager = (email) => {
  const router = useRouter();
  let statusCode = null;
  let statusMessage = null;
  const loginController = async (details) => {
    try {
      const response = await Axios.post(`/auth/login`, details);

      return response?.data;
    } catch (error) {
      statusCode = error?.response?.status;
      statusMessage = error?.response?.data?.message;
      throw new Error(`${error?.response?.data?.message}`);
    }
  };

  const mutation = useMutation(loginController, {
    onSuccess: (data) => {
      const token = data?.data?.token;
      const isAdmin = data?.data?.user?.roles[0]?.name === "admin";

      localStorage.setItem("token", token);

      // Verify token was saved
      const savedToken = localStorage.getItem("token");
      if (savedToken !== token) {
        throw new Error("Token storage failed");
      }

      router.push(isAdmin ? `/admin/dashboard` : `/dashboard`);
    },

    onError: (error) => {
      if (statusCode === 401) {
        toast.error(statusMessage);
      }
      if (statusCode === 402) {
        router.push(`/auth/verify-account?email=${email}`);
      }
      console.error("Login error:", error);
    },
  });

  const login = async (details) => {
    try {
      await mutation.mutateAsync(details);
    } catch (error) {
      // Handle error if necessary
      console.error("Login error:", error);
    }
  };

  return {
    login,
    data: mutation?.data,
    isLoading: mutation?.isLoading,
    isSuccess: mutation?.isSuccess,
    error: mutation?.error,
  };
};

export default useLoginManager;
