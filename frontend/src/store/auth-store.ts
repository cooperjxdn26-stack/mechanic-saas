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

function normalizeSession(sessionOrToken: any, userParam?: any): AuthState {
  if (typeof sessionOrToken === "string") {
    return {
      ...emptyAuthState(),
      token: sessionOrToken,
      user: userParam ?? null,
      isAuthenticated: true,
      isLoading: false,
    } as AuthState;
  }

  const token =
    sessionOrToken?.token ||
    sessionOrToken?.accessToken ||
    sessionOrToken?.data?.token ||
    sessionOrToken?.data?.accessToken ||
    null;

  const user =
    sessionOrToken?.user || sessionOrToken?.data?.user || userParam || null;

  const permissions =
    sessionOrToken?.permissions ||
    sessionOrToken?.data?.permissions ||
    user?.permissions ||
    [];

  const normalizedUser = user
    ? {
        ...user,
        permissions,
      }
    : null;

  return {
    ...emptyAuthState(),
    ...sessionOrToken,
    token,
    user: normalizedUser,
    permissions,
    isAuthenticated: Boolean(token),
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
    const session = normalizeSession({
      ...parsedSession,
      token: parsedSession?.token || storedToken,
    });

    return session;
  } catch (error) {
    console.error("Error leyendo sesión de autenticación:", error);
    clearAuthSession();
    return emptyAuthState();
  }
}

export function persistAuthSession(sessionOrToken: any, user?: any): AuthState {
  const session = normalizeSession(sessionOrToken, user);

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
