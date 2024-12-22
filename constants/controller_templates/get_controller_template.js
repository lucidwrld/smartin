import { useQuery } from "react-query";
import Axios from "../api_management/MyHttpHelper";
import AxiosWithToken from "../api_management/MyHttpHelperWithToken";

const useGetManager = (eventId) => {
  return useQuery(["enterKeyHere"], async () => {
    try {
      const [response] = [await AxiosWithToken.get(`endpoint`)];
       
      return response.data;
    } catch (error) { 
      throw new Error(`Sorry: ${error.response.data.message}`);
    }
  });
};

export default useGetManager;
