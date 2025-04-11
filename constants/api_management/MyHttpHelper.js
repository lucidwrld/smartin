import axios from "axios";

const baseURL = "https://invite-app-34766b534099.herokuapp.com/api/v1";
// const baseURL = "https://smart-invites-qe7l2.ondigitalocean.app/api/v1";

const Axios = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

export default Axios;
