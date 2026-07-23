// import axios from "axios";

// const axiosClient = axios.create({
//   baseURL: process.env.SERVER_URL,

//   headers: {
//     "Content-Type": "application/json",
//   },

//   withCredentials: true,
// });

// export default axiosClient;
import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.SERVER_URL,
  withCredentials: true,
});

export default axiosClient;
