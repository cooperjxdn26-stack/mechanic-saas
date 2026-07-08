import { api } from "@/lib/api";
import type { AdminRole, CreateRolePayload } from "@/types/admin";

export const rolesService = {
  async findAll(): Promise<AdminRole[]> {
    const response = await api.get<AdminRole[]>("/roles");
    return response.data;
  },

  async create(payload: CreateRolePayload): Promise<AdminRole> {
    const response = await api.post<AdminRole>("/roles", payload);
    return response.data;
  },
};
