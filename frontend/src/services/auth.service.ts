import { api } from "@/lib/api";
import type { LoginPayload, LoginResponse } from "@/types/auth";
import type { User } from "@/types/user";

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", payload);
    return response.data;
  },

  async profile(): Promise<User> {
    const response = await api.get<User>("/auth/profile");
    return response.data;
  },
};
