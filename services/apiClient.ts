import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import useAuthStore from "@/stores/auth.store";

// Define a generic MWResponse type
export type MWResponseType<T> = {
  success: boolean;
  message?: string;
  payload: T;
};

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

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

// Block mutations in guest mode
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const method = (config.method || "get").toLowerCase();
    const isMutating = ["post", "put", "patch", "delete"].includes(method);
    const { isGuest } = useAuthStore.getState();

    if (isGuest && isMutating) {
      // Reject with Axios-like error shape
      const err: Partial<AxiosError> = {
        response: {
          status: 403,
          statusText: "Forbidden",
          config,
          headers: {},
          data: { message: "Guest mode: read-only" },
        } as AxiosResponse,
      };
      return Promise.reject(err);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle responses and errors globally
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = (error?.config || {}) as RetryableConfig;
    const status = error?.response?.status;

    if (
      status === 401 &&
      !originalRequest._retry &&
      !String(originalRequest.url || "").includes("/users/refresh-token")
    ) {
      originalRequest._retry = true;
      try {
        await apiClient.post("/users/refresh-token");
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(
          (refreshError as AxiosError)?.response?.data || refreshError
        );
      }
    }

    return Promise.reject(
      error?.response?.data || { message: error?.message || "Unknown error" }
    );
  }
);

export default apiClient;
