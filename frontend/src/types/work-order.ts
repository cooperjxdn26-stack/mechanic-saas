import type { Vehicle } from "./vehicle";
import type { User, Branch } from "./user";

export type WorkOrderStatus =
  | "PENDING"
  | "RECEIVED"
  | "IN_DIAGNOSIS"
  | "WAITING_APPROVAL"
  | "IN_REPAIR"
  | "IN_TESTING"
  | "COMPLETED"
  | "DELIVERED"
  | "CANCELLED";

export type WorkOrderPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export type ChecklistStatus = "PENDING" | "PASSED" | "FAILED" | "WARNING";

export type DiagnosticType = "INITIAL" | "TECHNICAL" | "FINAL" | "AI_SUGGESTED";

export interface WorkOrder {
  id: string;
  code: string;
  reason: string;
  reportedSymptoms?: string | null;
  initialDiagnosis?: string | null;
  finalDiagnosis?: string | null;
  internalNotes?: string | null;
  status: WorkOrderStatus;
  priority: WorkOrderPriority;
  receivedAt: string;
  estimatedDelivery?: string | null;
  deliveredAt?: string | null;
  qrToken?: string | null;
  customerSignatureUrl?: string | null;
  vehicleId: string;
  branchId?: string | null;
  mechanicId?: string | null;
  createdById?: string | null;
  vehicle?: Vehicle;
  mechanic?: User | null;
  createdBy?: User | null;
  branch?: Branch | null;
  diagnostics?: Diagnostic[];
  checklists?: InspectionChecklist[];
  statusHistory?: WorkOrderStatusHistory[];
  comments?: WorkOrderComment[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrderQueryParams {
  search?: string;
  status?: WorkOrderStatus;
  priority?: WorkOrderPriority;
  mechanicId?: string;
  vehicleId?: string;
  branchId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface CreateWorkOrderPayload {
  reason: string;
  reportedSymptoms?: string;
  initialDiagnosis?: string;
  internalNotes?: string;
  status?: WorkOrderStatus;
  priority?: WorkOrderPriority;
  estimatedDelivery?: string;
  vehicleId: string;
  mechanicId?: string;
  branchId?: string;
}

export type UpdateWorkOrderPayload = Partial<CreateWorkOrderPayload>;

export interface ChangeWorkOrderStatusPayload {
  status: WorkOrderStatus;
  notes?: string;
}

export interface CreateChecklistItemPayload {
  item: string;
  status?: ChecklistStatus;
  notes?: string;
}

export interface InspectionChecklist {
  id: string;
  item: string;
  status: ChecklistStatus;
  notes?: string | null;
  workOrderId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrderStatusHistory {
  id: string;
  oldStatus?: WorkOrderStatus | null;
  newStatus: WorkOrderStatus;
  notes?: string | null;
  workOrderId: string;
  changedById?: string | null;
  changedBy?: User | null;
  createdAt: string;
}

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
  mechanic?: User | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrderComment {
  id: string;
  content: string;
  isInternal: boolean;
  workOrderId?: string | null;
  userId?: string | null;
  user?: User | null;
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrderKanbanColumn {
  status: WorkOrderStatus;
  count: number;
  orders: WorkOrder[];
}

export interface WorkOrderTimeline {
  workOrderId: string;
  statusHistory: WorkOrderStatusHistory[];
  diagnostics: Diagnostic[];
  checklists: InspectionChecklist[];
  comments: WorkOrderComment[];
}

export interface WorkOrderStats {
  total: number;
  active: number;
  completed: number;
  delivered: number;
  cancelled: number;
  overdue: number;
  urgent: number;
}
