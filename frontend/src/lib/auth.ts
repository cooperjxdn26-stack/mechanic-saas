import type { User } from "@/types/user";
import {
  getAuthToken,
  getStoredUser,
  removeAuthToken,
  removeStoredUser,
  setAuthToken,
  setStoredUser,
} from "./storage";

export function saveSession(token: string, user: User): void {
  setAuthToken(token);
  setStoredUser(JSON.stringify(user));
}

export function clearSession(): void {
  removeAuthToken();
  removeStoredUser();
}

export function getSessionToken(): string | null {
  return getAuthToken();
}

export function getSessionUser(): User | null {
  const storedUser = getStoredUser();

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as User;
  } catch {
    clearSession();
    return null;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getSessionToken());
}
