import type { Company, Branch, User } from "./user";

export type ServiceCategory =
  | "MAINTENANCE"
  | "REPAIR"
  | "DIAGNOSIS"
  | "ELECTRIC"
  | "ENGINE"
  | "BRAKES"
  | "SUSPENSION"
  | "TRANSMISSION"
  | "OTHER";

export interface WorkshopService {
  id: string;
  name: string;
  description?: string | null;
  category: ServiceCategory;
  basePrice: string;
  estimatedTimeMinutes?: number | null;
  isActive: boolean;
  companyId?: string | null;
  company?: Company | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceQueryParams {
  search?: string;
  category?: ServiceCategory;
  companyId?: string;
  page?: number;
  limit?: number;
}

export interface CreateServicePayload {
  name: string;
  description?: string;
  category?: ServiceCategory;
  basePrice?: number;
  estimatedTimeMinutes?: number;
  isActive?: boolean;
  companyId?: string;
}

export type UpdateServicePayload = Partial<CreateServicePayload>;

export interface SupplierPreview {
  id: string;
  name: string;
  ruc?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface Part {
  id: string;
  name: string;
  code?: string | null;
  sku?: string | null;
  category?: string | null;
  brand?: string | null;
  description?: string | null;
  stock: number;
  minStock: number;
  purchasePrice: string;
  salePrice: string;
  location?: string | null;
  isActive: boolean;
  companyId?: string | null;
  supplierId?: string | null;
  company?: Company | null;
  supplier?: SupplierPreview | null;
  movements?: InventoryMovement[];
  createdAt: string;
  updatedAt: string;
}

export interface PartQueryParams {
  search?: string;
  category?: string;
  brand?: string;
  supplierId?: string;
  companyId?: string;
  lowStock?: boolean;
  page?: number;
  limit?: number;
}

export interface CreatePartPayload {
  name: string;
  code?: string;
  sku?: string;
  category?: string;
  brand?: string;
  description?: string;
  stock?: number;
  minStock?: number;
  purchasePrice?: number;
  salePrice?: number;
  location?: string;
  isActive?: boolean;
  companyId?: string;
  supplierId?: string;
}

export type UpdatePartPayload = Partial<CreatePartPayload>;

export type InventoryMovementType =
  | "IN"
  | "OUT"
  | "ADJUSTMENT"
  | "RETURN"
  | "LOSS";

export interface CreateInventoryMovementPayload {
  type: InventoryMovementType;
  quantity: number;
  reason?: string;
  reference?: string;
  branchId?: string;
}

export interface InventoryMovement {
  id: string;
  type: InventoryMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason?: string | null;
  reference?: string | null;
  partId: string;
  branchId?: string | null;
  createdById?: string | null;
  branch?: Branch | null;
  createdBy?: User | null;
  createdAt: string;
}

export interface KardexResponse {
  partId: string;
  movements: InventoryMovement[];
}

export interface InventoryMovementResult {
  part: Part;
  movement: InventoryMovement;
}
