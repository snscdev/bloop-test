import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { endpoints, createAxiosInstance } from 'src/lib/axios';

import { setStorage, KeysLocalStorage, removeAllStorage } from './localStorage';

type DataSignup = {
  name: string;
  phone: string;
  email: string;
  password: string;
  address: string;
  zipCode: string;
  country: string;
  state: string;
  city: string;
};

type LogoutParams = {
  removeStorage?: boolean;
};

type ValidateEmailResponse = {
  user: {
    email: string;
  };
  provider: string;
};

interface AuthState {
  postLoginRedirectPath: string | null;
  loading: boolean;
  userpassAuthenticated: boolean;
  userAuth0: string | null;
  user: any | null;
  accessToken: string | null;
  ssoValue: string | null;
  emailRegistered: string | null;
  setAccessToken: (accessToken: string) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (dataSignup: DataSignup) => Promise<void>;
  logout: (params?: LogoutParams) => void;
  sendEmailChangePassword: (email: string) => Promise<void>;
  validatePasswordChange: (token: string, email: string, password: string) => Promise<void>;
  getUserAuth0: () => Promise<void>;
  fetchUser: () => Promise<void>;
  validateEmail: (email: string) => Promise<ValidateEmailResponse | any>;
  setPostLoginRedirectPath: (path: string) => void;
  setEmailRegistered: (email: string) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      loading: false,
      postLoginRedirectPath: null,
      userpassAuthenticated: false,
      userAuth0: null,
      user: null,
      accessToken: null,
      ssoValue: null,
      emailRegistered: null,
      setEmailRegistered: (email: string) => {
        set({ emailRegistered: email.toLowerCase() });
      },
      login: async (email, password) => {
        try {
          set({ loading: true });
          const axiosInstance = createAxiosInstance();
          const response = await axiosInstance.post(endpoints.auth.login, {
            email,
            password,
          });
          setStorage(KeysLocalStorage.keyAccessToken, response.data.access_token);
          set({
            userpassAuthenticated: true,
            accessToken: response.data.access_token,
            loading: false,
          });
        } catch (error) {
          console.error('Error al iniciar sesión:', error);
          set({ loading: false });
          throw error;
        }
      },
      getUserAuth0: async () => {
        try {
          const axiosInstance = createAxiosInstance();
          const response = await axiosInstance.get(endpoints.auth.meAuth0);
          set({ userAuth0: response.data });
        } catch (error) {
          console.error('Error al obtener usuario Auth0:', error);
        }
      },
      fetchUser: async () => {
        try {
          const axiosInstance = createAxiosInstance();
          const response = await axiosInstance.get(endpoints.auth.profile);
          set({ user: response.data, userpassAuthenticated: true });
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
          throw error;
        }
      },
      signup: async (dataSignup: DataSignup) => {
        try {
          set({ loading: true });
          const axiosInstance = createAxiosInstance();
          const response = await axiosInstance.post(endpoints.auth.signup, dataSignup);
          setStorage(KeysLocalStorage.keyAccessToken, response.data.access_token);
          set({
            userpassAuthenticated: true,
            accessToken: response.data.access_token,
            loading: false,
          });
        } catch (error) {
          console.error('Error al registrar:', error);
          set({ loading: false });
          throw error;
        }
      },
      logout: (params: LogoutParams = { removeStorage: true }) => {
        set({ userpassAuthenticated: false, userAuth0: null, accessToken: null, user: null });
        if (params.removeStorage) {
          removeAllStorage();
        }
      },
      sendEmailChangePassword: async (email) => {
        try {
          const axiosInstance = createAxiosInstance();
          const response = await axiosInstance.post(endpoints.auth.changePassword, {
            email,
          });
          return response.data;
        } catch (error) {
          console.error('Error al enviar el correo para cambiar la contraseña:', error);
          throw error;
        }
      },
      validatePasswordChange: async (token, email, password) => {
        try {
          const axiosInstance = createAxiosInstance();
          const response = await axiosInstance.post(endpoints.auth.validatePassword, {
            token,
            email,
            newPassword: password,
          });
          return response.data;
        } catch (error) {
          console.error('Error al validar el cambio de contraseña:', error);
          throw error;
        }
      },
      setPostLoginRedirectPath: (path: string) => {
        set({ postLoginRedirectPath: path });
      },
      setAccessToken: (accessToken: string) => {
        set({ accessToken });
      },
      validateEmail: async (email) => {
        try {
          const axiosInstance = createAxiosInstance();
          const response = await axiosInstance.post(endpoints.auth.validateEmail, {
            email: email.toLowerCase(),
          });
          set({ ssoValue: response?.data?.provider || null });
          return response.data;
        } catch (error) {
          console.error('Error al validar el correo:', error);
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
      partialize: (state) =>
        ({
          postLoginRedirectPath: state.postLoginRedirectPath,
          userpassAuthenticated: state.userpassAuthenticated,
          userAuth0: state.userAuth0,
          user: state.user,
          accessToken: state.accessToken,
          ssoValue: state.ssoValue,
          emailRegistered: state.emailRegistered,
        }) as AuthState,
    }
  )
);

export default useAuthStore;
