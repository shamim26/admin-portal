import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  AxiosRequestConfig,
} from "axios";
import { toast } from "sonner";

// Define a generic MWResponse type
export type MWResponseType = {
  success: boolean;
  message?: string;
  payload: any;
};

type RetryableConfig = unknown & { _retry?: boolean };

// Create an Axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

  // Response interceptor
  apiClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error?.config as RetryableConfig;
      const status = error?.response?.status;

      // Handle token refresh
      if (
        status === 401 &&
        !originalRequest._retry &&
        !String((originalRequest as AxiosRequestConfig).url || "").includes(
          "/users/refresh-token"
        ) &&
        !String((originalRequest as AxiosRequestConfig).url || "").includes(
          "/users/login"
        ) &&
        !String((originalRequest as AxiosRequestConfig).url || "").includes(
          "/users/register"
        )
      ) {
        originalRequest._retry = true;
        try {
          await apiClient.post("/users/refresh-token");
          return apiClient(originalRequest as AxiosRequestConfig);
        } catch (refreshError) {
          return Promise.reject(
            (refreshError as AxiosError)?.response?.data || refreshError
          );
        }
      }

      let errorMessage = "An unexpected error occurred";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          errorMessage =
            (error.response.data as MWResponseType)?.message ||
            `Error ${error.response.status}: ${error.response.statusText}`;

          switch (error.response.status) {
            case 401:
              console.error("Unauthorized");
              break;
            case 403:
              console.error("Access forbidden");
              break;
            case 404:
              console.error("Resource not found");
              break;
            case 500:
              console.error("Server error");
              break;
            default:
              console.error(`Error: ${error.response.status}`);
          }
        } else if (error.request) {
          errorMessage = "No response from the server";
        } else {
          errorMessage = error.message;
        }
      }

      // Only show toast on client
      if (typeof window !== "undefined") {
        toast.error(errorMessage);
      }

      return Promise.reject(error);
    }
  );

export default apiClient;
