"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getApiErrorMessage } from "@/lib/api";
import { routes } from "@/config/routes";
import { authService } from "@/services/auth.service";
import {
  clearAuthSession,
  getInitialAuthState,
  persistAuthSession,
} from "@/store/auth-store";
import type { AuthState, LoginPayload } from "@/types/auth";

/*
 * Usuario autenticado sin null.
 * Esto evita el error:
 * User | null no es asignable a User.
 */
type AuthUser = NonNullable<AuthState["user"]>;

interface UseAuthReturn extends AuthState {
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

/*
 * Normaliza el rol del usuario.
 *
 * El backend puede devolver:
 * role: "SUPER_ADMIN"
 *
 * O en algunos endpoints:
 * role: { name: "SUPER_ADMIN" }
 *
 * El frontend debe trabajar siempre con:
 * role: "SUPER_ADMIN"
 */
function normalizeAuthUser(user: AuthUser): any {
  const userRecord = user as unknown as Record<string, unknown>;
  const roleValue = userRecord.role;

  if (
    typeof roleValue === "object" &&
    roleValue !== null &&
    "name" in roleValue
  ) {
    return {
      ...user,
      role: String((roleValue as { name: string }).name)
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "_"),
    } as any;
  }

  if (typeof roleValue === "string") {
    return {
      ...user,
      role: roleValue.trim().toUpperCase().replace(/\s+/g, "_"),
    } as any;
  }

  return user;
}

export function useAuth(): UseAuthReturn {
  const router = useRouter();

  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /*
   * Carga sesión desde localStorage.
   * Si el usuario existe, normalizamos el rol.
   */
  useEffect(() => {
    const initialState = getInitialAuthState();

    if (initialState.user) {
      const normalizedUser = normalizeAuthUser(initialState.user);

      setAuthState({
        ...initialState,
        user: normalizedUser,
      });
    } else {
      setAuthState(initialState);
    }

    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (payload: LoginPayload): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await authService.login(payload);

        /*
         * Aseguramos que el usuario guardado tenga:
         * role: "SUPER_ADMIN"
         * y no role: { name: "SUPER_ADMIN" }.
         */
        const normalizedUser = normalizeAuthUser(response.user);

        const nextState = persistAuthSession(
          response.accessToken,
          normalizedUser,
        );

        setAuthState(nextState);
        router.push(routes.dashboard);
      } catch (requestError: unknown) {
        setError(getApiErrorMessage(requestError));
      } finally {
        setIsLoading(false);
      }
    },
    [router],
  );

  const logout = useCallback((): void => {
    const nextState = clearAuthSession();

    setAuthState(nextState);
    router.push(routes.login);
  }, [router]);

  const refreshProfile = useCallback(async (): Promise<void> => {
    try {
      const user = await authService.profile();

      if (!authState.token) {
        return;
      }

      /*
       * Normalizamos también cuando refrescamos el perfil.
       */
      const normalizedUser = normalizeAuthUser(user);

      const nextState = persistAuthSession(authState.token, normalizedUser);

      setAuthState(nextState);
    } catch {
      const nextState = clearAuthSession();

      setAuthState(nextState);
      router.push(routes.login);
    }
  }, [authState.token, router]);

  return {
    ...authState,
    isLoading,
    error,
    login,
    logout,
    refreshProfile,
  };
}
