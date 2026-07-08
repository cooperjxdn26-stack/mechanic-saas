import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/api";
import type { CreateUserPayload, UpdateUserPayload } from "@/types/admin";
import type { User } from "@/types/user";

/*
 * Algunos endpoints pueden devolver:
 * 1. { data: User[], meta: {...} }
 * 2. User[]
 *
 * Esta función normaliza ambas respuestas al formato paginado.
 * Así evitamos errores como users.length undefined.
 */
function normalizeUsersResponse(
  response: PaginatedResponse<User> | User[],
): PaginatedResponse<User> {
  if (Array.isArray(response)) {
    return {
      data: response,
      meta: {
        total: response.length,
        page: 1,
        limit: response.length,
        lastPage: 1,
      },
    };
  }

  return {
    data: Array.isArray(response.data) ? response.data : [],
    meta: response.meta ?? {
      total: Array.isArray(response.data) ? response.data.length : 0,
      page: 1,
      limit: Array.isArray(response.data) ? response.data.length : 0,
      lastPage: 1,
    },
  };
}

export const usersService = {
  async findAll(): Promise<PaginatedResponse<User>> {
    /*
     * Si tu api.ts ya tiene baseURL: http://localhost:3001/api,
     * esta ruta debe ser "/users?page=1&limit=50".
     */
    const response = await api.get<PaginatedResponse<User> | User[]>(
      "/users?page=1&limit=50",
    );

    return normalizeUsersResponse(response.data);
  },

  async findOne(id: string): Promise<User> {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  async create(payload: CreateUserPayload): Promise<User> {
    const response = await api.post<User>("/users", payload);
    return response.data;
  },

  async update(id: string, payload: UpdateUserPayload): Promise<User> {
    const response = await api.patch<User>(`/users/${id}`, payload);
    return response.data;
  },
};
