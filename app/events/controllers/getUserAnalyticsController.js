import { useQuery } from "react-query";
import { usePathname } from "next/navigation";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";

const useGetUserAnalyticsManager = () => {
  const pathname = usePathname();

  // Check if the current path includes '/admin'
  const isAdminPath = pathname?.includes("/admin");

  // Construct the endpoint based on the path
  const endpoint = isAdminPath ? "/event/analytics/admin" : "/event/analytics";

  return useQuery({
    queryKey: ["user_analytics", isAdminPath], // Include isAdminPath in queryKey to handle path changes
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(endpoint);
        return response.data;
      } catch (error) {
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    refetchOnWindowFocus: false,
  });
};

export default useGetUserAnalyticsManager;
