export enum KeysLocalStorage {
  keyAccessToken = 'accessToken',
  keyRefreshToken = 'refreshToken',
  keyUser = 'user',
}

export const setStorage = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

export const getStorage = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

export const removeStorage = (key: string) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

export const removeAllStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.clear();
  }
};
