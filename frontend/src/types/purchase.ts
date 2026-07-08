import type { Branch } from "./user";
import type { Part } from "./inventory";
import type { Supplier } from "./supplier";

export type PurchaseStatus = "DRAFT" | "ORDERED" | "RECEIVED" | "CANCELLED";

export interface PurchaseItem {
  id: string;
  quantity: number;
  unitPrice: string;
  total: string;
  purchaseId: string;
  partId: string;
  part?: Part;
  createdAt: string;
  updatedAt: string;
}

export interface Purchase {
  id: string;
  code: string;
  status: PurchaseStatus;
  subtotal: string;
  tax: string;
  total: string;
  notes?: string | null;
  supplierId?: string | null;
  branchId?: string | null;
  supplier?: Supplier | null;
  branch?: Branch | null;
  items: PurchaseItem[];
  createdAt: string;
  updatedAt: string;
}

export interface PurchaseQueryParams {
  search?: string;
  status?: PurchaseStatus;
  supplierId?: string;
  branchId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface CreatePurchaseItemPayload {
  partId: string;
  quantity: number;
  unitPrice: number;
}

export interface CreatePurchasePayload {
  status?: PurchaseStatus;
  tax?: number;
  notes?: string;
  supplierId?: string;
  branchId?: string;
  items: CreatePurchaseItemPayload[];
}

export interface UpdatePurchasePayload {
  status?: PurchaseStatus;
  tax?: number;
  notes?: string;
  supplierId?: string;
  branchId?: string;
}
