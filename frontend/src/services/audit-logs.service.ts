import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/api";
import type { AuditLog } from "@/types/admin";

export const auditLogsService = {
  async findAll(): Promise<PaginatedResponse<AuditLog>> {
    const response = await api.get<PaginatedResponse<AuditLog>>(
      "/audit-logs?page=1&limit=50",
    );

    return response.data;
  },
};
