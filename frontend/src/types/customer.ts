import type { Branch, Company } from "./user";

export type CustomerType = "NATURAL" | "COMPANY";

export type CustomerStatus = "ACTIVE" | "INACTIVE" | "VIP" | "DEBTOR";

export interface CustomerVehiclePreview {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year?: number | null;
}

export interface Customer {
  id: string;
  type: CustomerType;
  status: CustomerStatus;
  name: string;
  documentNumber?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  tags: string[];
  trustLevel: number;
  visitCount: number;
  totalDebt: string;
  companyId?: string | null;
  branchId?: string | null;
  company?: Company | null;
  branch?: Branch | null;
  vehicles?: CustomerVehiclePreview[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerQueryParams {
  search?: string;
  type?: CustomerType;
  status?: CustomerStatus;
  companyId?: string;
  branchId?: string;
  page?: number;
  limit?: number;
}

export interface CreateCustomerPayload {
  type?: CustomerType;
  status?: CustomerStatus;
  name: string;
  documentNumber?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  tags?: string[];
  trustLevel?: number;
  companyId?: string;
  branchId?: string;
}

export type UpdateCustomerPayload = Partial<CreateCustomerPayload>;

export interface CustomerStats {
  total: number;
  active: number;
  vip: number;
  debtor: number;
  inactive: number;
}
