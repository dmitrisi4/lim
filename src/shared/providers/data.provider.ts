import { axiosInstance } from "~/shared/api/client";

export const dataProvider = {
  get: async <T>(url: string, params?: unknown): Promise<T> => {
    const response = await axiosInstance.get<T>(url, { params });
    return response.data;
  },
  post: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await axiosInstance.post<T>(url, data);
    return response.data;
  },
  put: async <T>(url: string, data?: unknown): Promise<T> => {
    const response = await axiosInstance.put<T>(url, data);
    return response.data;
  },
  delete: async <T>(url: string): Promise<T> => {
    const response = await axiosInstance.delete<T>(url);
    return response.data;
  },
};
