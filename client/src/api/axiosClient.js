import axios from 'axios';

// In-memory token storage (never localStorage as primary store)
let memoryToken = null;

export const setAuthToken = (token) => {
  memoryToken = token;
};

export const getAuthToken = () => {
  return memoryToken;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Crucial: automatically attach httpOnly cookies on requests
  timeout: 10000,
});

// Request Interceptor: Attach in-memory token as Bearer authorization header if available
api.interceptors.request.use(
  (config) => {
    if (memoryToken) {
      config.headers.Authorization = `Bearer ${memoryToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global handler for 401 Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If receiving 401 on protected requests (except login/register/me initial checks)
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config.url.includes('/auth/login') &&
      !error.config.url.includes('/auth/register')
    ) {
      memoryToken = null;
    }
    return Promise.reject(error);
  }
);

export default api;
