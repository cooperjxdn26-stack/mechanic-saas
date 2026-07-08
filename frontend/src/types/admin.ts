import type { User } from "./user";

export type NotificationType =
  | "INFO"
  | "SUCCESS"
  | "WARNING"
  | "ERROR"
  | "STOCK"
  | "WORK_ORDER"
  | "PAYMENT";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: "PENDING" | "SENT" | "READ";
  isRead: boolean;
  userId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string | null;
  description?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  userId?: string | null;
  user?: User | null;
  createdAt: string;
}

export interface AdminRole {
  id: string;
  name: string;
  description?: string | null;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  roleId?: string;
  branchId?: string;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  roleId?: string;
  branchId?: string;
  status?: "ACTIVE" | "INACTIVE" | "BLOCKED";
}

export interface CreateRolePayload {
  name: string;
  description?: string;
}
