import { api } from "@/lib/api";
import type {
  CreateDiagnosticPayload,
  Diagnostic,
  UpdateDiagnosticPayload,
} from "@/types/diagnostic";

export const diagnosticsService = {
  async findAll(workOrderId?: string): Promise<Diagnostic[]> {
    const query = workOrderId ? `?workOrderId=${workOrderId}` : "";

    const response = await api.get<Diagnostic[]>(`/diagnostics${query}`);
    return response.data;
  },

  async findOne(id: string): Promise<Diagnostic> {
    const response = await api.get<Diagnostic>(`/diagnostics/${id}`);
    return response.data;
  },

  async create(payload: CreateDiagnosticPayload): Promise<Diagnostic> {
    const response = await api.post<Diagnostic>("/diagnostics", payload);
    return response.data;
  },

  async update(
    id: string,
    payload: UpdateDiagnosticPayload,
  ): Promise<Diagnostic> {
    const response = await api.patch<Diagnostic>(`/diagnostics/${id}`, payload);
    return response.data;
  },

  async remove(id: string): Promise<Diagnostic> {
    const response = await api.delete<Diagnostic>(`/diagnostics/${id}`);
    return response.data;
  },
};
