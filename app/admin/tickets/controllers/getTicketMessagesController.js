import { useQuery } from "react-query";
import AxiosWithToken from "@/constants/api_management/MyHttpHelperWithToken";
import { toast } from "react-toastify";

const useGetTicketMessagesManager = ({ ticketId }) => {
  return useQuery({
    queryKey: ["ticket_messages"],
    queryFn: async () => {
      try {
        const response = await AxiosWithToken.get(
          `/support/tickets/${ticketId}/messages`
        );
        return response.data;
      } catch (error) { 
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    enabled: Boolean(ticketId),
    // refetchOnWindowFocus: false,
  });
};

export default useGetTicketMessagesManager;
