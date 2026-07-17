import { api } from "@/lib/api";
import type { Backup, RestoreResponse, BackupConfig } from "@/types/continuity";

export const continuityService = {
  async findAll(): Promise<Backup[]> {
    const response = await api.get<Backup[]>("/continuity/backup");
    return response.data;
  },

  async createBackup(): Promise<Backup> {
    const response = await api.post<Backup>("/continuity/backup/create");
    return response.data;
  },

  async restoreBackup(id: string): Promise<RestoreResponse> {
    const response = await api.post<RestoreResponse>(`/continuity/backup/restore/${id}`);
    return response.data;
  },

  async deleteBackup(id: string): Promise<{ status: string; message: string }> {
    const response = await api.delete<{ status: string; message: string }>(`/continuity/backup/${id}`);
    return response.data;
  },

  async getConfig(): Promise<BackupConfig> {
    const response = await api.get<BackupConfig>("/continuity/config");
    return response.data;
  },

  async saveConfig(config: BackupConfig): Promise<BackupConfig> {
    const response = await api.post<BackupConfig>("/continuity/config", config);
    return response.data;
  },

  async downloadBackup(id: string, filename: string): Promise<void> {
    const response = await api.get(`/continuity/backup/download/${id}`, {
      responseType: "blob",
    });

    // Crear un elemento link temporal para gatillar la descarga en el cliente
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    
    // Limpieza
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};
