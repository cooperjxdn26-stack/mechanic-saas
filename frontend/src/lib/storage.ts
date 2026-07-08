const TOKEN_KEY = "mechanic_saas_token";
const USER_KEY = "mechanic_saas_user";

export function getStorageItem(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(key);
}

export function setStorageItem(key: string, value: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, value);
}

export function removeStorageItem(key: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(key);
}

export function getAuthToken(): string | null {
  return getStorageItem(TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  setStorageItem(TOKEN_KEY, token);
}

export function removeAuthToken(): void {
  removeStorageItem(TOKEN_KEY);
}

export function getStoredUser(): string | null {
  return getStorageItem(USER_KEY);
}

export function setStoredUser(user: string): void {
  setStorageItem(USER_KEY, user);
}

export function removeStoredUser(): void {
  removeStorageItem(USER_KEY);
}
