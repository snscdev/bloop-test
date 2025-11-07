import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/global-config';
import { getStorage, removeStorage, KeysLocalStorage } from 'src/store/localStorage';

// ----------------------------------------------------------------------

// Helper para manejar errores 401 Unauthorized
const handle401Error = () => {
  if (typeof window !== 'undefined') {
    // Guardar la ruta actual para redirección post-login
    const currentPath = window.location.pathname + window.location.search;

    // Importar dinámicamente el store para evitar problemas de SSR
    import('src/store/AuthStore').then((module) => {
      const useAuthStore = module.default;
      const { setPostLoginRedirectPath } = useAuthStore.getState();
      setPostLoginRedirectPath(currentPath);
    });

    // Limpiar token inválido
    removeStorage(KeysLocalStorage.keyAccessToken);

    // Redirigir al login
    window.location.href = '/auth/sign-in';
  }
};

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
      // Detectar error 401 Unauthorized
      if (error?.response?.status === 401) {
        const responseData = error?.response?.data;
        // Verificar si el mensaje es "Unauthorized"
        if (responseData?.message === 'Unauthorized' || responseData?.statusCode === 401) {
          handle401Error();
        }
      }

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
    // Detectar error 401 Unauthorized
    if (error?.response?.status === 401) {
      const responseData = error?.response?.data;
      // Verificar si el mensaje es "Unauthorized"
      if (responseData?.message === 'Unauthorized' || responseData?.statusCode === 401) {
        handle401Error();
      }
    }

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
    // Endpoints del flujo de checkout
    initial: (id: string) => `/api/v1/products/${id}/initial`,
    models: (id: string, conditionId: string) =>
      `/api/v1/products/${id}/conditions/${conditionId}/models`,
    storage: (id: string, modelId: string, conditionId: string) =>
      `/api/v1/products/${id}/models/${modelId}/conditions/${conditionId}/storage`,
    colors: (id: string, storageId: string) => `/api/v1/products/${id}/storage/${storageId}/colors`,
    accessories: (id: string, colorId: string) =>
      `/api/v1/products/${id}/colors/${colorId}/accessories`,
  },
} as const;
