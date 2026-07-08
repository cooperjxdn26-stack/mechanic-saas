import type { AuthState } from "@/types/auth";

const AUTH_STORAGE_KEY = "mechanic_saas_auth";
const TOKEN_STORAGE_KEY = "mechanic_saas_token";

function emptyAuthState(): AuthState {
  return {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  } as AuthState;
}

export function getInitialAuthState(): AuthState {
  if (typeof window === "undefined") {
    return emptyAuthState();
  }

  try {
    const storedSession = localStorage.getItem(AUTH_STORAGE_KEY);
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!storedSession && !storedToken) {
      return emptyAuthState();
    }

    const parsedSession = storedSession ? JSON.parse(storedSession) : {};

    const token =
      parsedSession?.token || parsedSession?.accessToken || storedToken || null;

    return {
      ...emptyAuthState(),
      ...parsedSession,
      token,
      isAuthenticated: Boolean(token),
      isLoading: false,
    } as AuthState;
  } catch (error) {
    console.error("Error leyendo sesión de autenticación:", error);
    clearAuthSession();
    return emptyAuthState();
  }
}

export function persistAuthSession(sessionOrToken: any, user?: any): AuthState {
  let session: AuthState;

  if (typeof sessionOrToken === "string") {
    session = {
      ...emptyAuthState(),
      token: sessionOrToken,
      user: user ?? null,
      isAuthenticated: true,
      isLoading: false,
    } as AuthState;
  } else {
    const token =
      sessionOrToken?.token ||
      sessionOrToken?.accessToken ||
      sessionOrToken?.data?.token ||
      sessionOrToken?.data?.accessToken ||
      null;

    session = {
      ...emptyAuthState(),
      ...sessionOrToken,
      token,
      user: sessionOrToken?.user || sessionOrToken?.data?.user || user || null,
      isAuthenticated: Boolean(token),
      isLoading: false,
    } as AuthState;
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));

    if (session.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, session.token);

      document.cookie = `mechanic_saas_token=${session.token}; path=/; max-age=86400`;
      document.cookie = `token=${session.token}; path=/; max-age=86400`;
    }
  }

  return session;
}

export function clearAuthSession(): AuthState {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);

    document.cookie =
      "mechanic_saas_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }

  return emptyAuthState();
}
