import axios from "axios";

// const baseURL = "https://invite-app-34766b534099.herokuapp.com/api/v1";
const baseURL = "https://smart-invites-qe7l2.ondigitalocean.app/api/v1";

const AxiosWithToken = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

let retryCount = 0;

AxiosWithToken.interceptors.request.use(
  async (config) => {
    const isAdminRoute = config.url?.includes("/admin");
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("token"); //supposed to be admin-token

    // console.log(`Route type: ${isAdminRoute ? "Admin" : "User"}`);
    // console.log("User token:", token);
    // console.log("Admin token:", adminToken);

    if (isAdminRoute && !adminToken && retryCount < 3) {
      console.log(`Admin token retry attempt ${retryCount + 1}`);
      await new Promise((resolve) => setTimeout(resolve, 100));
      retryCount++;
      return AxiosWithToken.request(config);
    } else if (!isAdminRoute && !token && retryCount < 3) {
      console.log(`User token retry attempt ${retryCount + 1}`);
      await new Promise((resolve) => setTimeout(resolve, 100));
      retryCount++;
      return AxiosWithToken.request(config);
    }

    if (retryCount === 3) {
      console.log("Max retries reached, proceeding without token");
      retryCount = 0;
      return config;
    }

    const authToken = isAdminRoute ? adminToken : token;
    console.log("Using token:", authToken);

    config.headers.Authorization = authToken || "";
    retryCount = 0;
    return config;
  },
  (error) => Promise.reject(error)
);

AxiosWithToken.interceptors.response.use(
  (response) => {
    // Handle successful responses here
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = "/auth/login";

      return Promise.reject(error);
    }

    // Handle other error cases here if needed

    return Promise.reject(error);
  }
);

export default AxiosWithToken;
