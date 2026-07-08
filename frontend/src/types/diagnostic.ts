import type { User } from "./user";
import type { WorkOrder } from "./work-order";

export type DiagnosticType = "INITIAL" | "TECHNICAL" | "FINAL" | "AI_SUGGESTED";

export interface Diagnostic {
  id: string;
  type: DiagnosticType;
  title: string;
  description: string;
  aiSuggestion?: string | null;
  confidence?: number | null;
  solution?: string | null;
  notes?: string | null;
  workOrderId: string;
  mechanicId?: string | null;
  workOrder?: WorkOrder;
  mechanic?: User | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDiagnosticPayload {
  type?: DiagnosticType;
  title: string;
  description: string;
  aiSuggestion?: string;
  confidence?: number;
  solution?: string;
  notes?: string;
  workOrderId: string;
  mechanicId?: string;
}

export type UpdateDiagnosticPayload = Partial<CreateDiagnosticPayload>;
