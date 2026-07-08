export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export interface Role {
  id: string;
  name: string;
  description?: string | null;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  ruc?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  logoUrl?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Branch {
  id: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  isMain: boolean;
  isActive: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  status: UserStatus;
  companyId?: string | null;
  branchId?: string | null;
  roleId?: string | null;
  role?: Role | null;
  company?: Company | null;
  branch?: Branch | null;
  createdAt: string;
  updatedAt: string;
}

export interface CurrentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string | null;
  roleId?: string | null;
  companyId?: string | null;
  branchId?: string | null;
}
