import { axiosInstance } from "~/shared/api/client";

export const authProvider = {
  getMe: async <T>() => {
    const response = await axiosInstance.get<T>("/auth/me");
    return response.data;
  },
  logout: async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  }
};
