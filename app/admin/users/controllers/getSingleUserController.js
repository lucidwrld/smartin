import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { toast } from "react-toastify";

const useGetSingleUser = ({
  enabled = true,

  userId = "",
}) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(`/user/${userId}`);
        return response.data;
      } catch (error) {
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

export default useGetSingleUser;
