import type { Customer } from "./customer";
import type { CashRegister } from "./cash-register";
import type { Invoice } from "./invoice";
import type { User } from "./user";

export type PaymentMethod =
  | "CASH"
  | "CARD"
  | "TRANSFER"
  | "YAPE"
  | "PLIN"
  | "POS"
  | "CREDIT"
  | "OTHER";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface Payment {
  id: string;
  code: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: string;
  reference?: string | null;
  notes?: string | null;
  paidAt: string;
  customerId?: string | null;
  invoiceId?: string | null;
  cashRegisterId?: string | null;
  receivedById?: string | null;
  customer?: Customer | null;
  invoice?: Invoice | null;
  cashRegister?: CashRegister | null;
  receivedBy?: User | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentQueryParams {
  search?: string;
  method?: PaymentMethod;
  status?: PaymentStatus;
  customerId?: string;
  invoiceId?: string;
  cashRegisterId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface CreatePaymentPayload {
  method: PaymentMethod;
  status?: PaymentStatus;
  amount: number;
  reference?: string;
  notes?: string;
  customerId?: string;
  invoiceId?: string;
  cashRegisterId?: string;
}

export interface PaymentSummary {
  total: number;
  byMethod: Record<string, number>;
  count: number;
}
