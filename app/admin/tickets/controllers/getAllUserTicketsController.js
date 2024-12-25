import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { toast } from "react-toastify";

const useGetAllUserTicketsManager = ({
  page,
  searchQuery = "",
  enabled = true,
  pageSize = "20",
}) => {
  return useQuery({
    queryKey: ["tickets", page, searchQuery],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `/support/user/tickets?page=${page}&pageSize=${pageSize}`
        );
        return response.data;
      } catch (error) { 
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

export default useGetAllUserTicketsManager;
