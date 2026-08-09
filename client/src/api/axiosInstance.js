import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/api';

/* Configure Axios Instance for simplified API requests */
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/* Shared refresh promise to prevent multiple simultaneous refresh requests */
let refreshPromise = null;

/**
 * Response Interceptor for handling 401 Unauthorized errors
 * and automatically refreshing the access token if needed.
 * If the refresh fails, the user is redirected to the login page.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const isAuthEndpoint =
      originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/register') || originalRequest.url?.includes('/auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true }).finally(() => {
            refreshPromise = null;
          });
        }

        await refreshPromise;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
