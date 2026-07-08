import axios, { AxiosError, type AxiosInstance } from "axios";

import { appConfig } from "@/config/app";
import { getAuthToken, removeAuthToken, removeStoredUser } from "@/lib/storage";
import type { ApiErrorResponse } from "@/types/api";

export const api: AxiosInstance = axios.create({
  baseURL: appConfig.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * Interceptor de request:
 * agrega automáticamente el token JWT a cada petición.
 */
api.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/*
 * Interceptor de response:
 * si el backend responde 401, limpiamos sesión local.
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      removeAuthToken();
      removeStoredUser();
    }

    return Promise.reject(error);
  },
);

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (typeof message === "string") {
      return message;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Ocurrió un error inesperado";
}
