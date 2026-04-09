import axios from "axios";
import { env } from "~/shared/config/env";

/**
 * Configure Axios Instance
 */
export const axiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.status, error.message);
    return Promise.reject(error);
  }
);
