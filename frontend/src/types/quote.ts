import type { Customer } from "./customer";
import type { Part, WorkshopService } from "./inventory";
import type { Vehicle } from "./vehicle";
import type { WorkOrder } from "./work-order";

export type QuoteStatus =
  | "DRAFT"
  | "SENT"
  | "APPROVED"
  | "REJECTED"
  | "CONVERTED";

export type QuoteItemType = "SERVICE" | "PART" | "LABOR" | "EXTRA";

export interface QuoteItem {
  id: string;
  type: QuoteItemType;
  description: string;
  quantity: number;
  unitPrice: string;
  discount: string;
  total: string;
  quoteId: string;
  serviceId?: string | null;
  partId?: string | null;
  service?: WorkshopService | null;
  part?: Part | null;
  createdAt: string;
  updatedAt: string;
}

export interface Quote {
  id: string;
  code: string;
  status: QuoteStatus;
  subtotal: string;
  discount: string;
  tax: string;
  total: string;
  validUntil?: string | null;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  publicToken: string;
  notes?: string | null;
  customerId: string;
  vehicleId?: string | null;
  workOrderId?: string | null;
  customer?: Customer;
  vehicle?: Vehicle | null;
  workOrder?: WorkOrder | null;
  items: QuoteItem[];
  createdAt: string;
  updatedAt: string;
}

export interface QuoteQueryParams {
  search?: string;
  status?: QuoteStatus;
  customerId?: string;
  vehicleId?: string;
  workOrderId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface CreateQuoteItemPayload {
  type: QuoteItemType;
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  serviceId?: string;
  partId?: string;
}

export interface CreateQuotePayload {
  status?: QuoteStatus;
  discount?: number;
  tax?: number;
  validUntil?: string;
  notes?: string;
  customerId: string;
  vehicleId?: string;
  workOrderId?: string;
  items: CreateQuoteItemPayload[];
}

export type UpdateQuotePayload = Partial<CreateQuotePayload>;
