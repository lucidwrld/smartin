import { useQuery } from "react-query";
import Axios from "@/constants/api_management/MyHttpHelper";

const useGetAccessCodeDetailsManager = ({ code }) => {
  return useQuery({
    queryKey: ["accessCode", code],
    queryFn: async () => {
      try {
        const response = await Axios.get(`/event/access-code/${code}`);
        return response.data;
      } catch (error) {
        throw new Error("Sorry: " + error.response?.data?.message);
      }
    },
    enabled: Boolean(code),
    refetchOnWindowFocus: false,
  });
};

export default useGetAccessCodeDetailsManager;
