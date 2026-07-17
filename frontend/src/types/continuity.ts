import type { Company, User } from "./user";

export type BackupType = "MANUAL" | "AUTOMATIC";

export type BackupStatus = "PENDING" | "RUNNING" | "SUCCESS" | "FAILED" | "RESTORED";

export interface Backup {
  id: string;
  filename: string;
  path?: string | null;
  type: BackupType;
  status: BackupStatus;
  size?: string | null;
  companyId?: string | null;
  createdById?: string | null;
  createdAt: string;
  updatedAt: string;

  // Relaciones
  createdBy?: Pick<User, "id" | "firstName" | "lastName" | "email"> | null;
  company?: Pick<Company, "id" | "name"> | null;
}

export interface RestoreResponse {
  status: "SUCCESS" | "FAILED";
  message: string;
}

export interface BackupConfig {
  enabled: boolean;
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  hour: number;
  minute: number;
  dayOfWeek?: number; // 0 (Domingo) - 6 (Sábado)
  maxBackups: number;
  lastExecuted?: string | null;
}

