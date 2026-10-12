import axios from 'axios';

// In-memory token storage (never localStorage as primary store)
let memoryToken = null;

export const setAuthToken = (token) => {
  memoryToken = token;
};

export const getAuthToken = () => {
  return memoryToken;
};

// Dynamic Server Origin & API Base URL
export const SERVER_ORIGIN =
  import.meta.env.VITE_SERVER_URL ||
  (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : '') ||
  (import.meta.env.PROD ? '' : 'http://localhost:5000');

export const getAssetUrl = (urlPath) => {
  if (!urlPath) return '';
  if (urlPath.startsWith('http://') || urlPath.startsWith('https://')) return urlPath;
  return `${SERVER_ORIGIN}${urlPath.startsWith('/') ? '' : '/'}${urlPath}`;
};

const defaultBaseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: defaultBaseURL,
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
