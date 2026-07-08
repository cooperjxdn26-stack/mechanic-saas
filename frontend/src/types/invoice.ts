import type { Customer } from "./customer";
import type { Payment } from "./payment";
import type { Quote } from "./quote";
import type { WorkOrder } from "./work-order";

export type InvoiceStatus = "ISSUED" | "PAID" | "PARTIALLY_PAID" | "CANCELLED";

export interface Invoice {
  id: string;
  code: string;
  status: InvoiceStatus;
  subtotal: string;
  discount: string;
  tax: string;
  total: string;
  issuedAt: string;
  pdfUrl?: string | null;
  customerId: string;
  quoteId?: string | null;
  workOrderId?: string | null;
  customer?: Customer;
  quote?: Quote | null;
  workOrder?: WorkOrder | null;
  payments?: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceQueryParams {
  search?: string;
  status?: InvoiceStatus;
  customerId?: string;
  quoteId?: string;
  workOrderId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface CreateInvoicePayload {
  customerId: string;
  quoteId?: string;
  workOrderId?: string;
  subtotal?: number;
  discount?: number;
  tax?: number;
  total?: number;
  pdfUrl?: string;
}
