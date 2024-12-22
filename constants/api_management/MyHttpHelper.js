import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
 
const Axios = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

export default Axios;
