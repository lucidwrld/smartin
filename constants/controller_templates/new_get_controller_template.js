import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { toast } from "react-toastify";

const getFunction = async ({ page, pageSize, searchQuery }) => {
  try {
    const response = await AxiosWithToken.get(
      `/accounts/charity/list?page=${page}&pageSize=${pageSize}${searchQuery}`
    );
    return response.data;
  } catch (error) { 
    throw new Error("Sorry: " + error.response?.data?.message);
  }
};

const useGetAllGroupsManager = ({
  page,
  searchQuery = "",
  enabled = true,
  pageSize = "20",
}) => {
  return useQuery({
    queryKey: ["groups", page, searchQuery],
    queryFn: () => getFunction({ page, pageSize, searchQuery }),
    enabled: enabled,
    refetchOnWindowFocus: false,
  });
};

export { useGetAllGroupsManager, getFunction };
