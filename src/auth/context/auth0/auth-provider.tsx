'use client';

import type { AppState } from '@auth0/auth0-react';

import { useAuth0, Auth0Provider } from '@auth0/auth0-react';
import { useMemo, useState, useEffect, useCallback } from 'react';

import axios from 'src/lib/axios';
import { CONFIG } from 'src/global-config';
import useAuthStore from 'src/store/AuthStore';
import { getStorage, setStorage, KeysLocalStorage } from 'src/store/localStorage';

import { AuthContext } from '../auth-context';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { domain, clientId, callbackUrl } = CONFIG.auth0;

  const onRedirectCallback = useCallback((appState?: AppState) => {
    window.location.replace(appState?.returnTo || window.location.pathname);
  }, []);

  // Si no hay variables de Auth0, usar solo autenticación local
  if (!(domain && clientId && callbackUrl)) {
    return <LocalAuthProviderContainer>{children}</LocalAuthProviderContainer>;
  }

  const getCallbackUrl = () => {
    if (typeof window === 'undefined') {
      return CONFIG.auth0.callbackUrl;
    }
    const currentDomain = window.location.hostname;
    if (currentDomain.includes('www')) {
      return CONFIG.auth0.callbackUrl.replace('http://', 'http://www.');
    }
    return CONFIG.auth0.callbackUrl.replace('http://www.', 'http://');
  };

  const callbackUrlWithDomain = getCallbackUrl();

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: callbackUrlWithDomain, audience: CONFIG.auth0.audience }}
      onRedirectCallback={onRedirectCallback}
      cacheLocation="localstorage"
    >
      <AuthProviderContainer>{children}</AuthProviderContainer>
    </Auth0Provider>
  );
}

// ----------------------------------------------------------------------

// Container cuando Auth0 NO está disponible (solo autenticación local)
function LocalAuthProviderContainer({ children }: Props) {
  const { userpassAuthenticated, _hasHydrated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Esperar a que Zustand termine de hidratar desde localStorage
  useEffect(() => {
    if (_hasHydrated) {
      setIsHydrated(true);
    }
  }, [_hasHydrated]);

  useEffect(() => {
    if (isHydrated && userpassAuthenticated) {
      const token = getStorage(KeysLocalStorage.keyAccessToken) || '';
      setStorage(KeysLocalStorage.keyAccessToken, token);
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else if (isHydrated && !userpassAuthenticated) {
      setStorage(KeysLocalStorage.keyAccessToken, '');
      delete axios.defaults.headers.common.Authorization;
    }
  }, [userpassAuthenticated, isHydrated]);

  // Mostrar loading mientras se hidrata
  const checkAuthenticated = userpassAuthenticated ? 'authenticated' : 'unauthenticated';
  const status = isHydrated ? checkAuthenticated : 'loading';

  const memoizedValue = useMemo(
    () => ({
      user: null,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [status]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}

// Container cuando Auth0 está disponible (autenticación dual)
function AuthProviderContainer({ children }: Props) {
  const { user, isLoading, isAuthenticated, getAccessTokenSilently } = useAuth0();

  const { userpassAuthenticated, _hasHydrated } = useAuthStore();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Esperar a que Zustand termine de hidratar desde localStorage
  useEffect(() => {
    if (_hasHydrated) {
      setIsHydrated(true);
    }
  }, [_hasHydrated]);

  const getAccessToken = useCallback(async () => {
    try {
      if (isAuthenticated || userpassAuthenticated) {
        let token = '';

        if (isAuthenticated) {
          token = await getAccessTokenSilently({
            authorizationParams: {
              audience: CONFIG.auth0.audience,
            },
          });
        } else {
          token = getStorage(KeysLocalStorage.keyAccessToken) || '';
        }

        setAccessToken(token);
        setStorage(KeysLocalStorage.keyAccessToken, token || '');
        axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      } else {
        setAccessToken(null);
        setStorage(KeysLocalStorage.keyAccessToken, '');
        delete axios.defaults.headers.common.Authorization;
      }
    } catch (error) {
      console.error(error);
    }
  }, [getAccessTokenSilently, isAuthenticated, userpassAuthenticated]);

  useEffect(() => {
    // Solo ejecutar getAccessToken cuando Zustand haya hidratado
    if (isHydrated) {
      getAccessToken();
    }
  }, [getAccessToken, isHydrated]);

  // ----------------------------------------------------------------------

  const checkAuthenticated =
    isAuthenticated || userpassAuthenticated ? 'authenticated' : 'unauthenticated';

  // Combinar loading de Auth0 + loading de hidratación de Zustand
  const status = isLoading || !isHydrated ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: user
        ? {
            ...user,
            id: user?.sub,
            accessToken,
            displayName: user?.name,
            photoURL: user?.picture,
            role: user?.role ?? 'admin',
          }
        : null,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [accessToken, status, user]
  );

  return <AuthContext value={memoizedValue}>{children}</AuthContext>;
}
