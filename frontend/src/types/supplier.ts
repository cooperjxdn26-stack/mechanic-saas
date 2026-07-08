import type { Company } from "./user";
import type { Part } from "./inventory";
import type { Purchase } from "./purchase";

export interface Supplier {
  id: string;
  name: string;
  ruc?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  contactName?: string | null;
  notes?: string | null;
  isActive: boolean;
  companyId?: string | null;
  company?: Company | null;
  parts?: Part[];
  purchases?: Purchase[];
  _count?: {
    parts: number;
    purchases: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface SupplierQueryParams {
  search?: string;
  companyId?: string;
  page?: number;
  limit?: number;
}

export interface CreateSupplierPayload {
  name: string;
  ruc?: string;
  phone?: string;
  email?: string;
  address?: string;
  contactName?: string;
  notes?: string;
  isActive?: boolean;
  companyId?: string;
}

export type UpdateSupplierPayload = Partial<CreateSupplierPayload>;
