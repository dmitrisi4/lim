import { axiosInstance } from "~/shared/api/client";

export const authProvider = {
  getMe: async <T>() => {
    const response = await axiosInstance.get<T>("/auth/me");
    return response.data;
  },
  login: async <T>(data: any) => {
    const response = await axiosInstance.post<T>("/auth/login", data);
    return response.data;
  },
  register: async <T>(data: any) => {
    const response = await axiosInstance.post<T>("/auth/register", data);
    return response.data;
  },
  logout: async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
  }
};
