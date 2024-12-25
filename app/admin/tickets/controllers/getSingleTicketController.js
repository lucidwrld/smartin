import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { toast } from "react-toastify";

const useGetSingleTicketManager = ({ enabled = true, ticketId = "" }) => {
  return useQuery({
    queryKey: ["ticket"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `/support/tickets/${ticketId}`
        );
        return response.data;
      } catch (error) { 
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    enabled: enabled,
  });
};

export default useGetSingleTicketManager;
