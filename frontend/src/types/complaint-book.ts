export type CustomerType = "NATURAL" | "COMPANY";

export type ComplaintDocumentType = "DNI" | "CE" | "RUC" | "PASSPORT" | "OTHER";

export type ComplaintGoodType = "PRODUCT" | "SERVICE" | "PART" | "OTHER";

export type ComplaintCaseType = "CLAIM" | "COMPLAINT";

export type ComplaintResponseMethod =
  | "EMAIL"
  | "PHONE"
  | "WHATSAPP"
  | "IN_PERSON";

export type ComplaintBookStatus =
  | "REGISTERED"
  | "UNDER_REVIEW"
  | "ANSWERED"
  | "CLOSED"
  | "EXPIRED"
  | "CANCELLED";

export interface CreateComplaintBookEntryPayload {
  companyId?: string;
  branchId?: string;
  customerId?: string;
  vehicleId?: string;
  workOrderId?: string;

  physicalSheetNumber?: string;

  claimantType?: CustomerType;
  claimantName: string;
  claimantDocumentType?: ComplaintDocumentType;
  claimantDocumentNumber: string;
  claimantAddress?: string;
  claimantPhone?: string;
  claimantEmail?: string;

  isMinor?: boolean;
  guardianName?: string;
  guardianDocumentType?: ComplaintDocumentType;
  guardianDocumentNumber?: string;
  guardianAddress?: string;
  guardianPhone?: string;
  guardianEmail?: string;

  goodType: ComplaintGoodType;
  claimedAmount?: number;
  goodDescription: string;

  serviceOrderCode?: string;
  vehiclePlate?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  serviceDate?: string;
  paymentDocument?: string;

  caseType: ComplaintCaseType;
  detail: string;
  customerRequest: string;
  responseMethod?: ComplaintResponseMethod;

  acceptedDeclaration?: boolean;
  createdById?: string;
}

export interface ComplaintBookEntry {
  id: string;
  code: string;
  physicalSheetNumber?: string | null;

  claimantType: CustomerType;
  claimantName: string;
  claimantDocumentType: ComplaintDocumentType;
  claimantDocumentNumber: string;
  claimantAddress?: string | null;
  claimantPhone?: string | null;
  claimantEmail?: string | null;

  goodType: ComplaintGoodType;
  claimedAmount?: string | number | null;
  goodDescription: string;

  serviceOrderCode?: string | null;
  vehiclePlate?: string | null;
  vehicleBrand?: string | null;
  vehicleModel?: string | null;
  serviceDate?: string | null;
  paymentDocument?: string | null;

  caseType: ComplaintCaseType;
  detail: string;
  customerRequest: string;
  responseMethod?: ComplaintResponseMethod | null;

  providerObservation?: string | null;
  actionsTaken?: string | null;
  responseDetail?: string | null;

  status: ComplaintBookStatus;

  registeredAt: string;
  dueDate?: string | null;
  answeredAt?: string | null;
  closedAt?: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface ComplaintBookListResponse {
  items: ComplaintBookEntry[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
