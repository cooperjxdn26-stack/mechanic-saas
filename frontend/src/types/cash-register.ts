import type { Branch, User } from "./user";
import type { Payment } from "./payment";

export type CashRegisterStatus = "OPEN" | "CLOSED";

export interface CashRegister {
  id: string;
  code: string;
  status: CashRegisterStatus;
  openingAmount: string;
  closingAmount?: string | null;
  expectedAmount?: string | null;
  difference?: string | null;
  notes?: string | null;
  openedAt: string;
  closedAt?: string | null;
  branchId?: string | null;
  openedById?: string | null;
  branch?: Branch | null;
  openedBy?: User | null;
  payments?: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface OpenCashRegisterPayload {
  openingAmount: number;
  notes?: string;
  branchId?: string;
}

export interface CloseCashRegisterPayload {
  closingAmount: number;
  notes?: string;
}

export interface CashRegisterSummary {
  cashRegisterId: string;
  code: string;
  status: CashRegisterStatus;
  openingAmount: number;
  paymentsTotal: number;
  expectedAmount: number;
  closingAmount: number | null;
  difference: number | null;
  byMethod: Record<string, number>;
  paymentsCount: number;
}
