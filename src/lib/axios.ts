import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/global-config';
import { getStorage, KeysLocalStorage } from 'src/store/localStorage';

// ----------------------------------------------------------------------

interface CreateAxiosInstanceProps {
  useBackendUrl?: boolean;
}

export const createAxiosInstance = ({ useBackendUrl = true }: CreateAxiosInstanceProps = {}) => {
  const accessToken = getStorage(KeysLocalStorage.keyAccessToken);
  const instance = axios.create({
    baseURL: useBackendUrl ? process.env.NEXT_PUBLIC_BACKEND_URL : CONFIG.serverUrl,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
    },
  });

  instance.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error?.response?.data?.message || error?.message || 'Something went wrong!';
      console.error('Axios error:', message);
      return Promise.reject(new Error(message));
    }
  );

  return instance;
};

// Default instance for backwards compatibility
const axiosInstance = axios.create({
  baseURL: CONFIG.serverUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getStorage(KeysLocalStorage.keyAccessToken);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error?.response?.data?.message || error?.message || 'Something went wrong!';
    console.error('Axios error:', message);
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async <T = unknown>(
  args: string | [string, AxiosRequestConfig]
): Promise<T> => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args, {}];

    const res = await axiosInstance.get<T>(url, config);

    return res.data;
  } catch (error) {
    console.error('Fetcher failed:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    signIn: '/api/auth/sign-in',
    signUp: '/api/auth/sign-up',
    validateEmail: '/auth/validate-email-exists',
    login: '/auth/login',
    signup: '/auth/create-user',
    meAuth0: '/auth/userinfo',
    profile: '/auth/profile',
    changePassword: '/auth/request-password-change',
    validatePassword: '/auth/validate-password-reset',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
} as const;
