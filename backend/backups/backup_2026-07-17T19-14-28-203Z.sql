--
-- PostgreSQL database dump
--

\restrict cVxXvIb1NXy0ZqRMqHkSPlYRY5vRTMoXgFH9rt960RYTEwg3T6dvLzkEqUcmdse

-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: AppointmentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AppointmentStatus" AS ENUM (
    'SCHEDULED',
    'CONFIRMED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW'
);


ALTER TYPE public."AppointmentStatus" OWNER TO postgres;

--
-- Name: AttachmentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AttachmentType" AS ENUM (
    'IMAGE',
    'PDF',
    'DOCUMENT',
    'SIGNATURE',
    'OTHER'
);


ALTER TYPE public."AttachmentType" OWNER TO postgres;

--
-- Name: AuditAction; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AuditAction" AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE',
    'LOGIN',
    'LOGOUT',
    'APPROVE',
    'REJECT',
    'EXPORT',
    'PAYMENT',
    'STATUS_CHANGE',
    'CREATE_BACKUP',
    'CREATE_BACKUP_FAILED',
    'DOWNLOAD_BACKUP',
    'RESTORE_BACKUP'
);


ALTER TYPE public."AuditAction" OWNER TO postgres;

--
-- Name: BackupStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BackupStatus" AS ENUM (
    'PENDING',
    'RUNNING',
    'SUCCESS',
    'FAILED',
    'RESTORED'
);


ALTER TYPE public."BackupStatus" OWNER TO postgres;

--
-- Name: BackupType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."BackupType" AS ENUM (
    'MANUAL',
    'AUTOMATIC'
);


ALTER TYPE public."BackupType" OWNER TO postgres;

--
-- Name: CashRegisterStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CashRegisterStatus" AS ENUM (
    'OPEN',
    'CLOSED'
);


ALTER TYPE public."CashRegisterStatus" OWNER TO postgres;

--
-- Name: ChecklistStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ChecklistStatus" AS ENUM (
    'PENDING',
    'PASSED',
    'FAILED',
    'WARNING'
);


ALTER TYPE public."ChecklistStatus" OWNER TO postgres;

--
-- Name: ComplaintAttachmentCategory; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ComplaintAttachmentCategory" AS ENUM (
    'CUSTOMER_EVIDENCE',
    'PROVIDER_RESPONSE',
    'INTERNAL'
);


ALTER TYPE public."ComplaintAttachmentCategory" OWNER TO postgres;

--
-- Name: ComplaintBookStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ComplaintBookStatus" AS ENUM (
    'REGISTERED',
    'UNDER_REVIEW',
    'ANSWERED',
    'CLOSED',
    'EXPIRED',
    'CANCELLED'
);


ALTER TYPE public."ComplaintBookStatus" OWNER TO postgres;

--
-- Name: ComplaintCaseType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ComplaintCaseType" AS ENUM (
    'CLAIM',
    'COMPLAINT'
);


ALTER TYPE public."ComplaintCaseType" OWNER TO postgres;

--
-- Name: ComplaintDocumentType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ComplaintDocumentType" AS ENUM (
    'DNI',
    'CE',
    'RUC',
    'PASSPORT',
    'OTHER'
);


ALTER TYPE public."ComplaintDocumentType" OWNER TO postgres;

--
-- Name: ComplaintGoodType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ComplaintGoodType" AS ENUM (
    'PRODUCT',
    'SERVICE',
    'PART',
    'OTHER'
);


ALTER TYPE public."ComplaintGoodType" OWNER TO postgres;

--
-- Name: ComplaintResponseMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ComplaintResponseMethod" AS ENUM (
    'EMAIL',
    'PHONE',
    'WHATSAPP',
    'IN_PERSON'
);


ALTER TYPE public."ComplaintResponseMethod" OWNER TO postgres;

--
-- Name: CustomerStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CustomerStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'VIP',
    'DEBTOR'
);


ALTER TYPE public."CustomerStatus" OWNER TO postgres;

--
-- Name: CustomerType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."CustomerType" AS ENUM (
    'NATURAL',
    'COMPANY'
);


ALTER TYPE public."CustomerType" OWNER TO postgres;

--
-- Name: DiagnosticType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."DiagnosticType" AS ENUM (
    'INITIAL',
    'TECHNICAL',
    'FINAL',
    'AI_SUGGESTED'
);


ALTER TYPE public."DiagnosticType" OWNER TO postgres;

--
-- Name: InventoryMovementType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InventoryMovementType" AS ENUM (
    'IN',
    'OUT',
    'ADJUSTMENT',
    'RETURN',
    'LOSS'
);


ALTER TYPE public."InventoryMovementType" OWNER TO postgres;

--
-- Name: InvoiceStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."InvoiceStatus" AS ENUM (
    'DRAFT',
    'ISSUED',
    'CANCELLED'
);


ALTER TYPE public."InvoiceStatus" OWNER TO postgres;

--
-- Name: MaintenanceReminderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."MaintenanceReminderStatus" AS ENUM (
    'PENDING',
    'SENT',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."MaintenanceReminderStatus" OWNER TO postgres;

--
-- Name: NotificationStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NotificationStatus" AS ENUM (
    'PENDING',
    'SENT',
    'READ',
    'FAILED'
);


ALTER TYPE public."NotificationStatus" OWNER TO postgres;

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."NotificationType" AS ENUM (
    'INTERNAL',
    'EMAIL',
    'WHATSAPP',
    'SYSTEM'
);


ALTER TYPE public."NotificationType" OWNER TO postgres;

--
-- Name: PaymentMethod; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentMethod" AS ENUM (
    'CASH',
    'CARD',
    'TRANSFER',
    'YAPE',
    'PLIN',
    'POS',
    'CREDIT',
    'OTHER'
);


ALTER TYPE public."PaymentMethod" OWNER TO postgres;

--
-- Name: PaymentStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PaymentStatus" AS ENUM (
    'PENDING',
    'PARTIAL',
    'PAID',
    'OVERDUE',
    'CANCELLED'
);


ALTER TYPE public."PaymentStatus" OWNER TO postgres;

--
-- Name: PurchaseStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."PurchaseStatus" AS ENUM (
    'DRAFT',
    'ORDERED',
    'RECEIVED',
    'CANCELLED'
);


ALTER TYPE public."PurchaseStatus" OWNER TO postgres;

--
-- Name: QuoteItemType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."QuoteItemType" AS ENUM (
    'SERVICE',
    'PART',
    'LABOR',
    'EXTRA'
);


ALTER TYPE public."QuoteItemType" OWNER TO postgres;

--
-- Name: QuoteStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."QuoteStatus" AS ENUM (
    'DRAFT',
    'SENT',
    'APPROVED',
    'REJECTED',
    'EXPIRED',
    'CONVERTED'
);


ALTER TYPE public."QuoteStatus" OWNER TO postgres;

--
-- Name: ServiceCategory; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."ServiceCategory" AS ENUM (
    'ENGINE',
    'BRAKES',
    'SUSPENSION',
    'ELECTRICAL',
    'TIRES',
    'MAINTENANCE',
    'DIAGNOSTIC',
    'TRANSMISSION',
    'OTHER'
);


ALTER TYPE public."ServiceCategory" OWNER TO postgres;

--
-- Name: UserStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."UserStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'BLOCKED'
);


ALTER TYPE public."UserStatus" OWNER TO postgres;

--
-- Name: VehicleFuelType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."VehicleFuelType" AS ENUM (
    'GASOLINE',
    'DIESEL',
    'GAS',
    'HYBRID',
    'ELECTRIC',
    'OTHER'
);


ALTER TYPE public."VehicleFuelType" OWNER TO postgres;

--
-- Name: VehicleTransmission; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."VehicleTransmission" AS ENUM (
    'MANUAL',
    'AUTOMATIC',
    'CVT',
    'OTHER'
);


ALTER TYPE public."VehicleTransmission" OWNER TO postgres;

--
-- Name: VehicleType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."VehicleType" AS ENUM (
    'SEDAN',
    'SUV',
    'PICKUP',
    'VAN',
    'TRUCK',
    'MOTORCYCLE',
    'OTHER'
);


ALTER TYPE public."VehicleType" OWNER TO postgres;

--
-- Name: WorkOrderPriority; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."WorkOrderPriority" AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'URGENT'
);


ALTER TYPE public."WorkOrderPriority" OWNER TO postgres;

--
-- Name: WorkOrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."WorkOrderStatus" AS ENUM (
    'PENDING',
    'RECEIVED',
    'IN_DIAGNOSIS',
    'WAITING_APPROVAL',
    'IN_REPAIR',
    'IN_TESTING',
    'COMPLETED',
    'DELIVERED',
    'CANCELLED'
);


ALTER TYPE public."WorkOrderStatus" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Appointment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Appointment" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    status public."AppointmentStatus" DEFAULT 'SCHEDULED'::public."AppointmentStatus" NOT NULL,
    "startAt" timestamp(3) without time zone NOT NULL,
    "endAt" timestamp(3) without time zone NOT NULL,
    "reminderAt" timestamp(3) without time zone,
    "customerId" text,
    "vehicleId" text,
    "branchId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Appointment" OWNER TO postgres;

--
-- Name: Attachment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Attachment" (
    id text NOT NULL,
    filename text NOT NULL,
    url text NOT NULL,
    "mimeType" text,
    size integer,
    type public."AttachmentType" DEFAULT 'OTHER'::public."AttachmentType" NOT NULL,
    "workOrderId" text,
    "uploadedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Attachment" OWNER TO postgres;

--
-- Name: AuditLog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AuditLog" (
    id text NOT NULL,
    action public."AuditAction" NOT NULL,
    module text NOT NULL,
    entity text,
    "entityId" text,
    description text,
    metadata jsonb,
    "ipAddress" text,
    "userAgent" text,
    "companyId" text,
    "userId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."AuditLog" OWNER TO postgres;

--
-- Name: Backup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Backup" (
    id text NOT NULL,
    filename text NOT NULL,
    path text,
    type public."BackupType" DEFAULT 'MANUAL'::public."BackupType" NOT NULL,
    status public."BackupStatus" DEFAULT 'PENDING'::public."BackupStatus" NOT NULL,
    size text,
    "companyId" text,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Backup" OWNER TO postgres;

--
-- Name: Branch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Branch" (
    id text NOT NULL,
    name text NOT NULL,
    address text,
    phone text,
    email text,
    "isMain" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "companyId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Branch" OWNER TO postgres;

--
-- Name: CashRegister; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CashRegister" (
    id text NOT NULL,
    code text NOT NULL,
    status public."CashRegisterStatus" DEFAULT 'OPEN'::public."CashRegisterStatus" NOT NULL,
    "openingAmount" numeric(12,2) DEFAULT 0 NOT NULL,
    "closingAmount" numeric(12,2),
    "expectedAmount" numeric(12,2),
    difference numeric(12,2),
    "openedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "closedAt" timestamp(3) without time zone,
    notes text,
    "branchId" text,
    "openedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."CashRegister" OWNER TO postgres;

--
-- Name: Comment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Comment" (
    id text NOT NULL,
    content text NOT NULL,
    "isInternal" boolean DEFAULT true NOT NULL,
    "workOrderId" text,
    "userId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Comment" OWNER TO postgres;

--
-- Name: Company; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Company" (
    id text NOT NULL,
    name text NOT NULL,
    ruc text,
    email text,
    phone text,
    address text,
    "logoUrl" text,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Company" OWNER TO postgres;

--
-- Name: ComplaintBookAttachment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ComplaintBookAttachment" (
    id text NOT NULL,
    "complaintBookEntryId" text NOT NULL,
    filename text NOT NULL,
    url text NOT NULL,
    "mimeType" text,
    size integer,
    type public."AttachmentType" DEFAULT 'OTHER'::public."AttachmentType" NOT NULL,
    category public."ComplaintAttachmentCategory" DEFAULT 'CUSTOMER_EVIDENCE'::public."ComplaintAttachmentCategory" NOT NULL,
    "uploadedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ComplaintBookAttachment" OWNER TO postgres;

--
-- Name: ComplaintBookEntry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ComplaintBookEntry" (
    id text NOT NULL,
    code text NOT NULL,
    "physicalSheetNumber" text,
    "companyId" text,
    "branchId" text,
    "customerId" text,
    "vehicleId" text,
    "workOrderId" text,
    "claimantType" public."CustomerType" DEFAULT 'NATURAL'::public."CustomerType" NOT NULL,
    "claimantName" text NOT NULL,
    "claimantDocumentType" public."ComplaintDocumentType" DEFAULT 'DNI'::public."ComplaintDocumentType" NOT NULL,
    "claimantDocumentNumber" text NOT NULL,
    "claimantAddress" text,
    "claimantPhone" text,
    "claimantEmail" text,
    "isMinor" boolean DEFAULT false NOT NULL,
    "guardianName" text,
    "guardianDocumentType" public."ComplaintDocumentType",
    "guardianDocumentNumber" text,
    "guardianAddress" text,
    "guardianPhone" text,
    "guardianEmail" text,
    "goodType" public."ComplaintGoodType" NOT NULL,
    "claimedAmount" numeric(12,2),
    "goodDescription" text NOT NULL,
    "serviceOrderCode" text,
    "vehiclePlate" text,
    "vehicleBrand" text,
    "vehicleModel" text,
    "serviceDate" timestamp(3) without time zone,
    "paymentDocument" text,
    "caseType" public."ComplaintCaseType" NOT NULL,
    detail text NOT NULL,
    "customerRequest" text NOT NULL,
    "responseMethod" public."ComplaintResponseMethod",
    "providerObservation" text,
    "actionsTaken" text,
    "responseDetail" text,
    status public."ComplaintBookStatus" DEFAULT 'REGISTERED'::public."ComplaintBookStatus" NOT NULL,
    "createdById" text,
    "responsibleId" text,
    "answeredById" text,
    "registeredAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "dueDate" timestamp(3) without time zone,
    "answeredAt" timestamp(3) without time zone,
    "closedAt" timestamp(3) without time zone,
    "acceptedDeclaration" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ComplaintBookEntry" OWNER TO postgres;

--
-- Name: ComplaintBookStatusHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."ComplaintBookStatusHistory" (
    id text NOT NULL,
    "complaintBookEntryId" text NOT NULL,
    "oldStatus" public."ComplaintBookStatus",
    "newStatus" public."ComplaintBookStatus" NOT NULL,
    comment text,
    "changedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ComplaintBookStatusHistory" OWNER TO postgres;

--
-- Name: Customer; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Customer" (
    id text NOT NULL,
    type public."CustomerType" DEFAULT 'NATURAL'::public."CustomerType" NOT NULL,
    status public."CustomerStatus" DEFAULT 'ACTIVE'::public."CustomerStatus" NOT NULL,
    name text NOT NULL,
    "documentNumber" text,
    phone text,
    email text,
    address text,
    notes text,
    tags text[] DEFAULT ARRAY[]::text[],
    "trustLevel" integer DEFAULT 0 NOT NULL,
    "visitCount" integer DEFAULT 0 NOT NULL,
    "totalDebt" numeric(12,2) DEFAULT 0 NOT NULL,
    "companyId" text,
    "branchId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Customer" OWNER TO postgres;

--
-- Name: Diagnostic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Diagnostic" (
    id text NOT NULL,
    type public."DiagnosticType" DEFAULT 'TECHNICAL'::public."DiagnosticType" NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    "aiSuggestion" text,
    confidence integer,
    solution text,
    notes text,
    "workOrderId" text NOT NULL,
    "mechanicId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Diagnostic" OWNER TO postgres;

--
-- Name: InspectionChecklist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InspectionChecklist" (
    id text NOT NULL,
    item text NOT NULL,
    status public."ChecklistStatus" DEFAULT 'PENDING'::public."ChecklistStatus" NOT NULL,
    notes text,
    "workOrderId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."InspectionChecklist" OWNER TO postgres;

--
-- Name: InventoryMovement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."InventoryMovement" (
    id text NOT NULL,
    type public."InventoryMovementType" NOT NULL,
    quantity integer NOT NULL,
    "previousStock" integer NOT NULL,
    "newStock" integer NOT NULL,
    reason text,
    reference text,
    "partId" text NOT NULL,
    "branchId" text,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."InventoryMovement" OWNER TO postgres;

--
-- Name: Invoice; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Invoice" (
    id text NOT NULL,
    code text NOT NULL,
    status public."InvoiceStatus" DEFAULT 'DRAFT'::public."InvoiceStatus" NOT NULL,
    subtotal numeric(12,2) DEFAULT 0 NOT NULL,
    discount numeric(12,2) DEFAULT 0 NOT NULL,
    tax numeric(12,2) DEFAULT 0 NOT NULL,
    total numeric(12,2) DEFAULT 0 NOT NULL,
    "issuedAt" timestamp(3) without time zone,
    "pdfUrl" text,
    "customerId" text NOT NULL,
    "quoteId" text,
    "workOrderId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Invoice" OWNER TO postgres;

--
-- Name: MaintenanceReminder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."MaintenanceReminder" (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "dueMileage" integer,
    "dueDate" timestamp(3) without time zone,
    status public."MaintenanceReminderStatus" DEFAULT 'PENDING'::public."MaintenanceReminderStatus" NOT NULL,
    "customerId" text,
    "vehicleId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."MaintenanceReminder" OWNER TO postgres;

--
-- Name: Notification; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Notification" (
    id text NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    type public."NotificationType" DEFAULT 'INTERNAL'::public."NotificationType" NOT NULL,
    status public."NotificationStatus" DEFAULT 'PENDING'::public."NotificationStatus" NOT NULL,
    "actionUrl" text,
    "sentAt" timestamp(3) without time zone,
    "readAt" timestamp(3) without time zone,
    "userId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Notification" OWNER TO postgres;

--
-- Name: Part; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Part" (
    id text NOT NULL,
    name text NOT NULL,
    code text,
    sku text,
    category text,
    brand text,
    description text,
    stock integer DEFAULT 0 NOT NULL,
    "minStock" integer DEFAULT 0 NOT NULL,
    "purchasePrice" numeric(12,2) DEFAULT 0 NOT NULL,
    "salePrice" numeric(12,2) DEFAULT 0 NOT NULL,
    location text,
    "isActive" boolean DEFAULT true NOT NULL,
    "companyId" text,
    "supplierId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Part" OWNER TO postgres;

--
-- Name: Payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Payment" (
    id text NOT NULL,
    code text NOT NULL,
    method public."PaymentMethod" NOT NULL,
    status public."PaymentStatus" DEFAULT 'PAID'::public."PaymentStatus" NOT NULL,
    amount numeric(12,2) DEFAULT 0 NOT NULL,
    reference text,
    notes text,
    "paidAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "customerId" text,
    "invoiceId" text,
    "cashRegisterId" text,
    "receivedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Payment" OWNER TO postgres;

--
-- Name: Permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Permission" (
    id text NOT NULL,
    name text NOT NULL,
    module text NOT NULL,
    action text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Permission" OWNER TO postgres;

--
-- Name: Purchase; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Purchase" (
    id text NOT NULL,
    code text NOT NULL,
    status public."PurchaseStatus" DEFAULT 'DRAFT'::public."PurchaseStatus" NOT NULL,
    subtotal numeric(12,2) DEFAULT 0 NOT NULL,
    tax numeric(12,2) DEFAULT 0 NOT NULL,
    total numeric(12,2) DEFAULT 0 NOT NULL,
    notes text,
    "supplierId" text,
    "branchId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Purchase" OWNER TO postgres;

--
-- Name: PurchaseItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."PurchaseItem" (
    id text NOT NULL,
    quantity integer NOT NULL,
    "unitPrice" numeric(12,2) DEFAULT 0 NOT NULL,
    total numeric(12,2) DEFAULT 0 NOT NULL,
    "purchaseId" text NOT NULL,
    "partId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."PurchaseItem" OWNER TO postgres;

--
-- Name: Quote; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Quote" (
    id text NOT NULL,
    code text NOT NULL,
    status public."QuoteStatus" DEFAULT 'DRAFT'::public."QuoteStatus" NOT NULL,
    subtotal numeric(12,2) DEFAULT 0 NOT NULL,
    discount numeric(12,2) DEFAULT 0 NOT NULL,
    tax numeric(12,2) DEFAULT 0 NOT NULL,
    total numeric(12,2) DEFAULT 0 NOT NULL,
    "validUntil" timestamp(3) without time zone,
    "publicToken" text,
    "approvedAt" timestamp(3) without time zone,
    "rejectedAt" timestamp(3) without time zone,
    notes text,
    "customerId" text NOT NULL,
    "vehicleId" text,
    "workOrderId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Quote" OWNER TO postgres;

--
-- Name: QuoteItem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."QuoteItem" (
    id text NOT NULL,
    type public."QuoteItemType" NOT NULL,
    description text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "unitPrice" numeric(12,2) DEFAULT 0 NOT NULL,
    discount numeric(12,2) DEFAULT 0 NOT NULL,
    total numeric(12,2) DEFAULT 0 NOT NULL,
    "quoteId" text NOT NULL,
    "serviceId" text,
    "partId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."QuoteItem" OWNER TO postgres;

--
-- Name: Role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Role" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "isSystem" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Role" OWNER TO postgres;

--
-- Name: RolePermission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."RolePermission" (
    id text NOT NULL,
    "roleId" text NOT NULL,
    "permissionId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."RolePermission" OWNER TO postgres;

--
-- Name: Service; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Service" (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    category public."ServiceCategory" DEFAULT 'OTHER'::public."ServiceCategory" NOT NULL,
    "basePrice" numeric(12,2) DEFAULT 0 NOT NULL,
    "estimatedTimeMinutes" integer,
    "isActive" boolean DEFAULT true NOT NULL,
    "companyId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Service" OWNER TO postgres;

--
-- Name: Supplier; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Supplier" (
    id text NOT NULL,
    name text NOT NULL,
    ruc text,
    phone text,
    email text,
    address text,
    "contactName" text,
    notes text,
    "isActive" boolean DEFAULT true NOT NULL,
    "companyId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Supplier" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    phone text,
    "avatarUrl" text,
    status public."UserStatus" DEFAULT 'ACTIVE'::public."UserStatus" NOT NULL,
    "companyId" text,
    "branchId" text,
    "roleId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: Vehicle; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Vehicle" (
    id text NOT NULL,
    plate text NOT NULL,
    brand text NOT NULL,
    model text NOT NULL,
    year integer,
    color text,
    vin text,
    mileage integer DEFAULT 0 NOT NULL,
    "fuelType" public."VehicleFuelType",
    transmission public."VehicleTransmission",
    type public."VehicleType",
    notes text,
    "customerId" text NOT NULL,
    "branchId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Vehicle" OWNER TO postgres;

--
-- Name: WorkOrder; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WorkOrder" (
    id text NOT NULL,
    code text NOT NULL,
    reason text NOT NULL,
    "reportedSymptoms" text,
    "initialDiagnosis" text,
    "finalDiagnosis" text,
    "internalNotes" text,
    status public."WorkOrderStatus" DEFAULT 'PENDING'::public."WorkOrderStatus" NOT NULL,
    priority public."WorkOrderPriority" DEFAULT 'MEDIUM'::public."WorkOrderPriority" NOT NULL,
    "receivedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "estimatedDelivery" timestamp(3) without time zone,
    "deliveredAt" timestamp(3) without time zone,
    "qrToken" text,
    "customerSignatureUrl" text,
    "vehicleId" text NOT NULL,
    "branchId" text,
    "mechanicId" text,
    "createdById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."WorkOrder" OWNER TO postgres;

--
-- Name: WorkOrderStatusHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."WorkOrderStatusHistory" (
    id text NOT NULL,
    "oldStatus" public."WorkOrderStatus",
    "newStatus" public."WorkOrderStatus" NOT NULL,
    notes text,
    "workOrderId" text NOT NULL,
    "changedById" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."WorkOrderStatusHistory" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: Appointment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Appointment" (id, title, description, status, "startAt", "endAt", "reminderAt", "customerId", "vehicleId", "branchId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Attachment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Attachment" (id, filename, url, "mimeType", size, type, "workOrderId", "uploadedById", "createdAt") FROM stdin;
\.


--
-- Data for Name: AuditLog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AuditLog" (id, action, module, entity, "entityId", description, metadata, "ipAddress", "userAgent", "companyId", "userId", "createdAt") FROM stdin;
cmpafzd030000g855uxzemq7n	CREATE	AuditLogs	System	manual-test	Prueba manual de auditoría desde Postman	{"source": "postman", "status": "testing"}	\N	\N	\N	\N	2026-05-18 00:04:34.323
cmpafzosw0001g85553xk8xer	STATUS_CHANGE	CashRegister	CashRegister	caja-test	Prueba manual de cambio de estado de caja	{"newStatus": "CLOSED", "oldStatus": "OPEN"}	\N	\N	\N	\N	2026-05-18 00:04:49.616
cmpag39240002g85533yk3pij	CREATE	AuditLogs	System	manual-test	Prueba manual de auditoría desde Postman	{"source": "postman", "status": "testing"}	\N	\N	\N	\N	2026-05-18 00:07:35.836
cmrmeuyr80000x055jmi5w6t2	RESTORE_BACKUP	CONTINUITY	Backup	cmrmbajke0000s455xyrmr8ft	Backup restaurado correctamente backup_2026-07-15T16-45-56-357Z.sql	{"filename": "backup_2026-07-15T16-45-56-357Z.sql"}	\N	\N	\N	\N	2026-07-15 18:25:48.404
cmrmf6qee0000d455vrmuhmq9	DELETE	CONTINUITY	Backup	cmrmb9xjc00004s554y53n8eo	Backup eliminado backup_2026-07-15T16-45-27-792Z.sql	{"filename": "backup_2026-07-15T16-45-27-792Z.sql"}	\N	\N	\N	\N	2026-07-15 18:34:57.446
\.


--
-- Data for Name: Backup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Backup" (id, filename, path, type, status, size, "companyId", "createdById", "createdAt", "updatedAt") FROM stdin;
cmrmaytmq0000x455b0xvro4g	backup_2026-07-15T16-36-49-613Z.sql	C:\\Users\\jorge\\Documents\\mechanic-saas\\backend\\backups\\backup_2026-07-15T16-36-49-613Z.sql	MANUAL	FAILED	\N	\N	\N	2026-07-15 16:36:49.922	2026-07-15 16:36:49.922
cmrmbajke0000s455xyrmr8ft	backup_2026-07-15T16-45-56-357Z.sql	C:\\Users\\jorge\\Documents\\mechanic-saas\\backend\\backups\\backup_2026-07-15T16-45-56-357Z.sql	MANUAL	SUCCESS	0.12 MB	\N	\N	2026-07-15 16:45:56.75	2026-07-15 16:45:56.75
\.


--
-- Data for Name: Branch; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Branch" (id, name, address, phone, email, "isMain", "isActive", "companyId", "createdAt", "updatedAt") FROM stdin;
cmp6bwoot0007xg55rxe9sjez	Sucursal Principal	Lima, Perú	999999999	\N	t	t	cmp6bwooa0006xg55puwymzce	2026-05-15 02:59:26.333	2026-05-15 02:59:26.333
\.


--
-- Data for Name: CashRegister; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CashRegister" (id, code, status, "openingAmount", "closingAmount", "expectedAmount", difference, "openedAt", "closedAt", notes, "branchId", "openedById", "createdAt", "updatedAt") FROM stdin;
cmp6pu0zz00044o558dg5l9rd	CAJA-2026-000001	CLOSED	5.00	5.00	5.00	0.00	2026-05-15 09:29:16.944	2026-05-15 15:09:23.329	\N	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 09:29:16.944	2026-05-15 15:09:23.359
cmp72zpsm000a5s55jwl9sylr	CAJA-2026-000002	CLOSED	0.00	0.00	0.00	0.00	2026-05-15 15:37:37.366	2026-05-17 18:23:10.189	\N	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 15:37:37.366	2026-05-17 18:23:10.206
cmpa3se5f00002055m2cswr1v	CAJA-2026-000003	CLOSED	0.00	0.00	0.00	0.00	2026-05-17 18:23:13.827	2026-05-17 18:23:29.914	\N	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-17 18:23:13.827	2026-05-17 18:23:29.915
cmpa3sv0j000120554rqzt2kt	CAJA-2026-000004	CLOSED	50.00	100.00	100.00	0.00	2026-05-17 18:23:35.684	2026-05-17 18:26:33.666	\N	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-17 18:23:35.684	2026-05-17 18:26:33.668
cmpads2060000t455enxcfqwr	CAJA-2026-000005	CLOSED	0.00	59.98	59.98	0.00	2026-05-17 23:02:54.246	2026-05-19 15:02:21.609	\N	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-17 23:02:54.246	2026-05-19 15:02:21.62
cmpcu1cyw0002jw55dk1t5c07	CAJA-2026-000006	CLOSED	0.00	0.00	0.00	0.00	2026-05-19 16:13:34.568	2026-05-19 16:13:43.582	\N	\N	cmpai880f0001ag55c6lwxqml	2026-05-19 16:13:34.568	2026-05-19 16:13:43.592
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Comment" (id, content, "isInternal", "workOrderId", "userId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Company; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Company" (id, name, ruc, email, phone, address, "logoUrl", "isActive", "createdAt", "updatedAt") FROM stdin;
cmp6bwooa0006xg55puwymzce	Taller Demo	00000000000	demo@taller.com	999999999	Lima, Perú	\N	t	2026-05-15 02:59:26.314	2026-05-15 02:59:26.314
\.


--
-- Data for Name: ComplaintBookAttachment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ComplaintBookAttachment" (id, "complaintBookEntryId", filename, url, "mimeType", size, type, category, "uploadedById", "createdAt") FROM stdin;
\.


--
-- Data for Name: ComplaintBookEntry; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ComplaintBookEntry" (id, code, "physicalSheetNumber", "companyId", "branchId", "customerId", "vehicleId", "workOrderId", "claimantType", "claimantName", "claimantDocumentType", "claimantDocumentNumber", "claimantAddress", "claimantPhone", "claimantEmail", "isMinor", "guardianName", "guardianDocumentType", "guardianDocumentNumber", "guardianAddress", "guardianPhone", "guardianEmail", "goodType", "claimedAmount", "goodDescription", "serviceOrderCode", "vehiclePlate", "vehicleBrand", "vehicleModel", "serviceDate", "paymentDocument", "caseType", detail, "customerRequest", "responseMethod", "providerObservation", "actionsTaken", "responseDetail", status, "createdById", "responsibleId", "answeredById", "registeredAt", "dueDate", "answeredAt", "closedAt", "acceptedDeclaration", "createdAt", "updatedAt") FROM stdin;
cmrcbd82q0000j4557h6soflj	LR-2026-000001	\N	\N	\N	\N	\N	\N	COMPANY	ASFDASFAS	DNI	2432432	\N	969679	\N	f	\N	\N	\N	\N	\N	\N	SERVICE	150.00	QWRQW	ASFQWRQW	QWRQW	QWRQWRQ	QWERQWR	2026-07-07 00:00:00	RQRQW	COMPLAINT	QWRQW	RWQRQW	EMAIL	\N	\N	\N	UNDER_REVIEW	\N	\N	\N	2026-07-08 16:50:20.017	2026-07-29 16:50:20.017	\N	\N	t	2026-07-08 16:50:20.066	2026-07-08 16:50:28.155
\.


--
-- Data for Name: ComplaintBookStatusHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."ComplaintBookStatusHistory" (id, "complaintBookEntryId", "oldStatus", "newStatus", comment, "changedById", "createdAt") FROM stdin;
cmrcbd8380001j455n0wvcj3w	cmrcbd82q0000j4557h6soflj	\N	REGISTERED	Reclamación registrada en el libro de reclamaciones.	\N	2026-07-08 16:50:20.066
cmrcbdebl0002j4558nz6ne3e	cmrcbd82q0000j4557h6soflj	REGISTERED	UNDER_REVIEW	\N	\N	2026-07-08 16:50:28.155
\.


--
-- Data for Name: Customer; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Customer" (id, type, status, name, "documentNumber", phone, email, address, notes, tags, "trustLevel", "visitCount", "totalDebt", "companyId", "branchId", "createdAt", "updatedAt") FROM stdin;
cmp6ebx0x0000k4551t0tdenq	NATURAL	VIP	Juan Pérez	74859612	999888777	juan@example.com	Lima, Perú	Cliente interesado en mantenimiento preventivo	{vip,frecuente,particular}	9	0	0.00	\N	\N	2026-05-15 04:07:16.21	2026-05-15 04:08:38.967
cmp6liuob0000jo55pvmzmsj0	NATURAL	ACTIVE	Renzo Lozano	74049006	987456321	\N	\N	\N	{vip}	5	0	0.00	\N	\N	2026-05-15 07:28:37.068	2026-05-15 07:28:45.737
cmp72uih700045s55q5bufrbx	NATURAL	ACTIVE	Cooper jaden	74049506	958746321	\N	\N	\N	{vip}	5	0	0.00	\N	\N	2026-05-15 15:33:34.603	2026-05-15 15:33:34.603
cmphpjcv20003vc55ae4mdi02	NATURAL	INACTIVE	Samy Smith	71432086	998962199	samyrdiazh@gmail.com	av.ramiro priale s/n	ninguan	{frecuente}	10	0	0.00	\N	\N	2026-05-23 02:06:27.038	2026-07-10 09:07:53.371
cmpairy870002ag55it9adcwi	NATURAL	DEBTOR	Jorge el lEON	74059653	965214836	\N	\N	\N	{}	5	0	0.00	\N	\N	2026-05-18 01:22:47.432	2026-07-10 09:08:04.615
\.


--
-- Data for Name: Diagnostic; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Diagnostic" (id, type, title, description, "aiSuggestion", confidence, solution, notes, "workOrderId", "mechanicId", "createdAt", "updatedAt") FROM stdin;
cmpao9sg00001po55y56hiebi	TECHNICAL	werw	werwe	\N	50	werwe	werew	cmp6lyxeh0007jo55u32i9quf	cmp6bwoql0008xg55wc5t1cfw	2026-05-18 03:56:37.824	2026-05-18 03:56:37.824
cmphh0mgu00003g5558a9knrf	TECHNICAL	Desgastes del lado isquierdo frenado	Nivelacion de	\N	90	Revision del vehiculo 	\N	cmp72w3l300065s55cgyzv1r6	cmp6bwoql0008xg55wc5t1cfw	2026-05-22 22:07:56.094	2026-05-22 22:07:56.094
cmphh8li200033g557tm2e77d	TECHNICAL	Alineacion de Ruedas delanteras	Se detecta desalineación en las ruedas delanteras, evidenciada por desviación del vehículo hacia un lado durante la conducción, desgaste irregular en los neumáticos delanteros y vibración leve en el volante. Se requiere revisión del sistema de dirección, suspensión y ángulos de alineación.	\N	95	Realizar alineación computarizada de ruedas delanteras, verificar presión de neumáticos, revisar terminales de dirección, rótulas y componentes de suspensión. Posteriormente, realizar prueba de manejo para confirmar que el vehículo mantenga una trayectoria recta y estable.	El cliente indica que el vehículo se desvía hacia la derecha al soltar el volante. Se recomienda verificar nuevamente el desgaste de neumáticos después de 7 días de uso o 300 km recorridos.	cmphh5wsh00013g55rofhp797	cmp6bwoql0008xg55wc5t1cfw	2026-05-22 22:14:08.09	2026-05-22 22:14:08.09
cmphp9lqz0002vc55qgzw0ock	TECHNICAL	choque grave en la parte frontal del coche	choque grave en la parte frontal del coche	\N	80	choque grave en la parte frontal del coche	choque grave en la parte frontal del coche	cmphp8cry0000vc55kpnno048	cmp6bwoql0008xg55wc5t1cfw	2026-05-23 01:58:51.995	2026-05-23 01:58:51.995
cmphq45bm0003ks5540e7ss0j	TECHNICAL	chowue de mototaxi	fallas electricas en el timon	\N	75	apertura de cables para revision	\N	cmphq2wsv0001ks55xhf8zs7l	cmp6bwoql0008xg55wc5t1cfw	2026-05-23 02:22:37.042	2026-05-23 02:22:37.042
\.


--
-- Data for Name: InspectionChecklist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InspectionChecklist" (id, item, status, notes, "workOrderId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: InventoryMovement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."InventoryMovement" (id, type, quantity, "previousStock", "newStock", reason, reference, "partId", "branchId", "createdById", "createdAt") FROM stdin;
cmp6nd1wu000fjo55b8nsm5bq	IN	15	0	15	Stock inicial	INITIAL_STOCK	cmp6nd1wd000ejo55n9fhiiu7	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 08:20:05.742
cmp6ndq3w000gjo55b08s95lg	OUT	1	15	14	asdsa	\N	cmp6nd1wd000ejo55n9fhiiu7	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 08:20:37.1
cmp6nykga000kjo55jj7lfqfi	IN	1	14	15	Compra recibida	COMP-2026-000001	cmp6nd1wd000ejo55n9fhiiu7	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 08:36:49.547
cmp6o89v5000ojo55sjzjwbaq	IN	5	0	5	Stock inicial	INITIAL_STOCK	cmp6o89uv000njo551sl5p83q	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 08:44:22.385
cmp6o9jtu000rjo55n9zrjzz7	IN	5	15	20	Compra recibida	COMP-2026-000002	cmp6nd1wd000ejo55n9fhiiu7	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 08:45:21.954
cmp6o9nm7000sjo552lli48pa	IN	1	5	6	Compra recibida	COMP-2026-000003	cmp6o89uv000njo551sl5p83q	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 08:45:26.863
cmp6pw5rb00074o55jrtvshnz	IN	1	6	7	Compra recibida	COMP-2026-000004	cmp6o89uv000njo551sl5p83q	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 09:30:56.423
cmp727jov0000aw55dhs0lb85	OUT	6	7	1	\N	\N	cmp6o89uv000njo551sl5p83q	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 15:15:43.088
cmp72phyj00015s55m3qe1p8u	IN	6	0	6	Stock inicial	INITIAL_STOCK	cmp72phy200005s553xtatdqq	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 15:29:40.651
cmp72rguy00025s55hvs5ssbs	OUT	4	6	2	\N	\N	cmp72phy200005s553xtatdqq	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 15:31:12.538
cmpcukini00058g55p4h2mkp3	IN	5	2	7	\N	\N	cmp72phy200005s553xtatdqq	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-19 16:28:28.398
\.


--
-- Data for Name: Invoice; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Invoice" (id, code, status, subtotal, discount, tax, total, "issuedAt", "pdfUrl", "customerId", "quoteId", "workOrderId", "createdAt", "updatedAt") FROM stdin;
cmp747d4x0001rc55rmvx1ylt	FAC-2026-000001	ISSUED	59.98	0.00	0.00	59.98	2026-05-15 16:11:33.819	\N	cmp72uih700045s55q5bufrbx	cmp7405bw0000yc55824ub1ef	cmp72w3l300065s55cgyzv1r6	2026-05-15 16:11:33.825	2026-05-15 16:11:33.825
cmp749ct10002rc55j2htiris	FAC-2026-000002	ISSUED	50.00	0.00	0.00	50.00	2026-05-15 16:13:06.709	\N	cmp72uih700045s55q5bufrbx	cmp72y5f900085s55fdqs3xq2	cmp72w3l300065s55cgyzv1r6	2026-05-15 16:13:06.709	2026-05-15 16:13:06.709
cmp74aec20003rc553z9kmr8k	FAC-2026-000003	ISSUED	44.99	0.00	0.00	44.99	2026-05-15 16:13:55.346	\N	cmp6liuob0000jo55pvmzmsj0	cmp6pi1wn00024o55awpeb2zs	cmp6ffpm30000rw55b9uu97k6	2026-05-15 16:13:55.346	2026-05-15 16:13:55.346
\.


--
-- Data for Name: MaintenanceReminder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."MaintenanceReminder" (id, title, description, "dueMileage", "dueDate", status, "customerId", "vehicleId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Notification" (id, title, message, type, status, "actionUrl", "sentAt", "readAt", "userId", "createdAt", "updatedAt") FROM stdin;
cmp72rgv000035s555uu5rwnc	Stock bajo de repuesto	El repuesto "Cutch de freno" quedó con stock bajo. Stock actual: 2. Stock mínimo: 4.	INTERNAL	READ	/dashboard/parts/cmp72phy200005s553xtatdqq	\N	2026-05-19 16:35:30.935	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 15:31:12.54	2026-05-19 16:35:30.969
\.


--
-- Data for Name: Part; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Part" (id, name, code, sku, category, brand, description, stock, "minStock", "purchasePrice", "salePrice", location, "isActive", "companyId", "supplierId", "createdAt", "updatedAt") FROM stdin;
cmp6nd1wd000ejo55n9fhiiu7	Pastillas de freno delantero	PF-D12	ASDSA-ASD	Frenos	Bosch	\N	20	3	50.00	100.00	a2	t	\N	\N	2026-05-15 08:20:05.725	2026-05-15 08:45:21.952
cmp6o89uv000njo551sl5p83q	Tanque de moto	asdas-5s5ad	adas-asdsa	Tanque	basd	\N	1	2	0.00	60.00	\N	t	\N	\N	2026-05-15 08:44:22.375	2026-05-15 15:15:43.065
cmp72phy200005s553xtatdqq	Cutch de freno	Ch-asd12	sdas-asdas	Frenos	Bosh	\N	7	4	20.00	50.00	\N	t	\N	\N	2026-05-15 15:29:40.635	2026-05-19 16:28:28.394
\.


--
-- Data for Name: Payment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Payment" (id, code, method, status, amount, reference, notes, "paidAt", "customerId", "invoiceId", "cashRegisterId", "receivedById", "createdAt", "updatedAt") FROM stdin;
cmp6pxb6b00084o5593krc9wc	PAY-2026-000001	CARD	PAID	20.00	\N	\N	2026-05-15 09:31:50.099	cmp6liuob0000jo55pvmzmsj0	\N	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 09:31:50.099	2026-05-15 09:31:50.099
cmp74apaj0004rc558qtf2z7i	PAY-2026-000002	YAPE	PAID	44.99	\N	\N	2026-05-15 16:14:09.547	cmp72uih700045s55q5bufrbx	cmp74aec20003rc553z9kmr8k	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 16:14:09.547	2026-05-15 16:14:09.547
cmpa3vamd00022055cc7b1bpc	PAY-2026-000003	CARD	PAID	50.00	\N	\N	2026-05-17 18:25:29.221	cmp72uih700045s55q5bufrbx	cmp749ct10002rc55j2htiris	cmpa3sv0j000120554rqzt2kt	cmp6bwoql0008xg55wc5t1cfw	2026-05-17 18:25:29.221	2026-05-17 18:25:29.221
cmpadu55k0001t455dwcmcnn1	PAY-2026-000004	CARD	PAID	59.98	\N	cls	2026-05-17 23:04:31.64	cmp72uih700045s55q5bufrbx	cmp747d4x0001rc55rmvx1ylt	cmpads2060000t455enxcfqwr	cmp6bwoql0008xg55wc5t1cfw	2026-05-17 23:04:31.64	2026-05-17 23:04:31.64
\.


--
-- Data for Name: Permission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Permission" (id, name, module, action, description, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Purchase; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Purchase" (id, code, status, subtotal, tax, total, notes, "supplierId", "branchId", "createdAt", "updatedAt") FROM stdin;
cmp6nxvys000ijo5552ttx1uu	COMP-2026-000001	RECEIVED	99.99	1.00	100.99	\N	cmp6nupsb000hjo55jze3kxiz	\N	2026-05-15 08:36:17.812	2026-05-15 08:36:49.528
cmp6o3g8a000ljo55ldt6w1br	COMP-2026-000002	RECEIVED	250.00	0.00	250.00	\N	cmp6nupsb000hjo55jze3kxiz	\N	2026-05-15 08:40:37.355	2026-05-15 08:45:21.946
cmp6o95ku000pjo55rxxu8an5	COMP-2026-000003	RECEIVED	59.99	0.00	59.99	\N	cmp6nupsb000hjo55jze3kxiz	\N	2026-05-15 08:45:03.486	2026-05-15 08:45:26.859
cmp6pw5qi00054o55iw2wkyoy	COMP-2026-000004	RECEIVED	0.00	0.00	0.00	\N	cmp6nupsb000hjo55jze3kxiz	\N	2026-05-15 09:30:56.394	2026-05-15 09:30:56.394
\.


--
-- Data for Name: PurchaseItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."PurchaseItem" (id, quantity, "unitPrice", total, "purchaseId", "partId", "createdAt") FROM stdin;
cmp6nxvz1000jjo55l1kzsvaf	1	99.99	99.99	cmp6nxvys000ijo5552ttx1uu	cmp6nd1wd000ejo55n9fhiiu7	2026-05-15 08:36:17.812
cmp6o3g8l000mjo55wgc8kse8	5	50.00	250.00	cmp6o3g8a000ljo55ldt6w1br	cmp6nd1wd000ejo55n9fhiiu7	2026-05-15 08:40:37.355
cmp6o95kx000qjo5519h4gjxo	1	59.99	59.99	cmp6o95ku000pjo55rxxu8an5	cmp6o89uv000njo551sl5p83q	2026-05-15 08:45:03.486
cmp6pw5qr00064o55v3tia7nc	1	0.00	0.00	cmp6pw5qi00054o55iw2wkyoy	cmp6o89uv000njo551sl5p83q	2026-05-15 09:30:56.394
\.


--
-- Data for Name: Quote; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Quote" (id, code, status, subtotal, discount, tax, total, "validUntil", "publicToken", "approvedAt", "rejectedAt", notes, "customerId", "vehicleId", "workOrderId", "createdAt", "updatedAt") FROM stdin;
cmp6p02n300004o55a5mody3t	COT-2026-000001	APPROVED	60.00	0.00	0.00	60.00	2026-05-16 00:00:00	5a84a34c-9794-4bb7-81dd-6455dcb64c4c	2026-05-15 09:07:16.313	\N	\N	cmp6liuob0000jo55pvmzmsj0	cmp6ll12d0001jo55to6vnlbx	\N	2026-05-15 09:05:59.392	2026-05-15 09:07:16.356
cmp7405bw0000yc55824ub1ef	COT-2026-000004	CONVERTED	59.98	0.00	0.00	59.98	2026-05-16 00:00:00	7e7258e5-ab43-4433-b04d-8db8024a6894	2026-05-15 16:06:16.423	\N	\N	cmp72uih700045s55q5bufrbx	cmp72vgc300055s55zvpizm18	cmp72w3l300065s55cgyzv1r6	2026-05-15 16:05:57.116	2026-05-15 16:11:33.888
cmp72y5f900085s55fdqs3xq2	COT-2026-000003	CONVERTED	50.00	0.00	0.00	50.00	\N	be47699c-d966-4628-bd3d-f6badea2d7f1	2026-05-15 15:36:34.089	\N	\N	cmp72uih700045s55q5bufrbx	cmp72vgc300055s55zvpizm18	cmp72w3l300065s55cgyzv1r6	2026-05-15 15:36:24.31	2026-05-15 16:13:06.793
cmp6pi1wn00024o55awpeb2zs	COT-2026-000002	CONVERTED	44.99	0.00	0.00	44.99	2026-05-16 00:00:00	84f1611e-ec31-4948-aedf-ef37ddfcc1d4	2026-05-15 09:20:06.074	\N	\N	cmp6liuob0000jo55pvmzmsj0	cmp6ll12d0001jo55to6vnlbx	cmp6ffpm30000rw55b9uu97k6	2026-05-15 09:19:58.248	2026-05-15 16:13:55.35
cmpcufli300018g55mwafo7wd	COT-2026-000005	SENT	5.00	0.00	0.00	5.00	2026-05-20 00:00:00	7aaafe94-b9a4-4436-9a7f-cd31138da074	\N	\N	\N	cmpairy870002ag55it9adcwi	cmpcu86x700008g552ib7bitn	cmpaomouz0002po551vd404wp	2026-05-19 16:24:38.811	2026-05-19 16:24:38.811
\.


--
-- Data for Name: QuoteItem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."QuoteItem" (id, type, description, quantity, "unitPrice", discount, total, "quoteId", "serviceId", "partId", "createdAt") FROM stdin;
cmp6p02nk00014o559ob4odbt	PART	Tanque de moto	1	60.00	0.00	60.00	cmp6p02n300004o55a5mody3t	\N	cmp6o89uv000njo551sl5p83q	2026-05-15 09:05:59.392
cmp6pi1x400034o558q9i82kb	LABOR	sadas	1	49.99	5.00	44.99	cmp6pi1wn00024o55awpeb2zs	\N	\N	2026-05-15 09:19:58.248
cmp72y5fd00095s55it0m3f6i	PART	Cutch de freno	1	50.00	0.00	50.00	cmp72y5f900085s55fdqs3xq2	\N	cmp72phy200005s553xtatdqq	2026-05-15 15:36:24.31
cmp740hzd0002yc55loca3k6b	SERVICE	asdas	1	59.98	0.00	59.98	cmp7405bw0000yc55824ub1ef	\N	\N	2026-05-15 16:06:13.509
cmpcuflid00028g55bkfwu7fl	PART	asdasd	1	5.00	0.00	5.00	cmpcufli300018g55mwafo7wd	\N	\N	2026-05-19 16:24:38.811
\.


--
-- Data for Name: Role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Role" (id, name, description, "isSystem", "createdAt", "updatedAt") FROM stdin;
cmp6bwolg0000xg5576fg9nhq	SUPER_ADMIN	Acceso total al sistema	t	2026-05-15 02:59:26.212	2026-05-15 02:59:26.212
cmp6bwoo00001xg55wjvx4bg5	ADMIN	Administrador del taller	t	2026-05-15 02:59:26.304	2026-05-15 02:59:26.304
cmp6bwoo30002xg557lpq86nn	RECEPTIONIST	Recepción, clientes, vehículos, citas y órdenes iniciales	t	2026-05-15 02:59:26.307	2026-05-15 02:59:26.307
cmp6bwoo50003xg55tnz5r9bg	MECHANIC	Gestión técnica de órdenes, diagnóstico y checklist	t	2026-05-15 02:59:26.309	2026-05-15 02:59:26.309
cmp6bwoo60004xg55agwh9ws8	CASHIER	Pagos, caja, facturación y cuentas por cobrar	t	2026-05-15 02:59:26.31	2026-05-15 02:59:26.31
cmp6bwoo80005xg557vblrljf	CUSTOMER	Portal del cliente	t	2026-05-15 02:59:26.312	2026-05-15 02:59:26.312
\.


--
-- Data for Name: RolePermission; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."RolePermission" (id, "roleId", "permissionId", "createdAt") FROM stdin;
\.


--
-- Data for Name: Service; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Service" (id, name, description, category, "basePrice", "estimatedTimeMinutes", "isActive", "companyId", "createdAt", "updatedAt") FROM stdin;
cmp6nbes9000djo55kliup89f	Cambio de Llanta	\N	OTHER	50.00	120	t	\N	2026-05-15 08:18:49.113	2026-05-15 08:18:49.113
cmpcujyab00048g555104sx04	Bajada de motor	\N	ENGINE	1000.00	300	t	\N	2026-05-19 16:28:02.003	2026-05-19 16:28:02.003
\.


--
-- Data for Name: Supplier; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Supplier" (id, name, ruc, phone, email, address, "contactName", notes, "isActive", "companyId", "createdAt", "updatedAt") FROM stdin;
cmp6nupsb000hjo55jze3kxiz	Repuestos por Mayor	2545974506	963258741	\N	Lima Pery 	Perey	\N	t	\N	2026-05-15 08:33:49.835	2026-05-15 08:33:49.835
cmphpory50004vc55kanbnj42	Repuestos S.A.C	20608401777	955311435	repuestossac@gmail.com	miraflores	Alembert Gamarra Cordova	todo correcto	t	\N	2026-05-23 02:10:39.87	2026-05-23 02:10:39.87
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, "firstName", "lastName", email, password, phone, "avatarUrl", status, "companyId", "branchId", "roleId", "createdAt", "updatedAt") FROM stdin;
cmp6bwoql0008xg55wc5t1cfw	Super	Admin	admin@mechanic.com	$2b$10$p/ochgwYuKb5whpAVM2OQeTntQeO5DSXqEGsxOgCXEe2nRwr5wDyW	999999999	\N	ACTIVE	cmp6bwooa0006xg55puwymzce	cmp6bwoot0007xg55rxe9sjez	cmp6bwolg0000xg5576fg9nhq	2026-05-15 02:59:26.397	2026-05-15 02:59:26.397
cmpaghztt0003g855sipn3vj5	Caros	Lozano	usuario@taller.com	$2b$10$g03EPF6Qy/ZvQRRcGP8dOONAYa8GVH.IxCjcFSHr48NiFfVRMRFGS	965231478	\N	ACTIVE	\N	\N	cmp6bwoo80005xg557vblrljf	2026-05-18 00:19:03.713	2026-05-18 00:19:03.713
cmpai6eus0000ag55f6uqsodv	renzo	ljoasd	mecanico@taller.com	$2b$10$2nadOZhpx.zQeXgF72VnieKBC0G5IQhetso2kCj8reZpvRPupvZVa	963258741	\N	ACTIVE	\N	\N	cmp6bwoo50003xg55tnz5r9bg	2026-05-18 01:06:02.549	2026-05-18 01:06:02.549
cmpai880f0001ag55c6lwxqml	naye	jas	cajera@taller.com	$2b$10$XNLYBapV4yZf3g8UNOT4G.v0wdbtH0xul2j1eLHwT1imJiqRfb4KG	987452136	\N	ACTIVE	\N	\N	cmp6bwoo60004xg55agwh9ws8	2026-05-18 01:07:26.991	2026-05-18 01:07:26.991
cmpctxxr90000jw55u5bh8bsh	Rucky	Saenz	recepcion@taller.com	$2b$10$zbVfGOhudQLbSnSNTQT5H.iAs/wWFt5f/72SpaXYKD8HKFs7js7gG	963258741	\N	ACTIVE	\N	\N	cmp6bwoo30002xg557lpq86nn	2026-05-19 16:10:54.885	2026-05-19 16:10:54.885
cmpctyrl10001jw55thklcy0q	johan	coop	renzo@admin.com	$2b$10$4m6LlmSM3NL79h6ns382t.mzp59PCrx82cOz4QXJIxvSAPpcSIUZW	987456321	\N	ACTIVE	\N	\N	cmp6bwoo00001xg55wjvx4bg5	2026-05-19 16:11:33.541	2026-05-19 16:11:33.541
cmphqftzh0005ks55l7dzeh8a	Samyr	Diaz	samyrdiazh@gmail.com	$2b$10$PGsVLOjPjd9fqaJooRZ4juM5yHTRfg06RcAUSXiEjFFeJ7J2PsG2i	998962199	\N	ACTIVE	\N	\N	cmp6bwoo50003xg55tnz5r9bg	2026-05-23 02:31:42.221	2026-05-23 02:31:42.221
cmphqu9r00006ks55frvn3o6e	Elvira	Ramos	elviraramos@gmai.com	$2b$10$LXte/260PArMs8jNiI0J7eHvlNZ.AA4X.IaXUNWiO.ztgp9dfzNq2	yyyyyyy	\N	ACTIVE	\N	\N	cmp6bwoo80005xg557vblrljf	2026-05-23 02:42:55.836	2026-05-23 02:42:55.836
\.


--
-- Data for Name: Vehicle; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Vehicle" (id, plate, brand, model, year, color, vin, mileage, "fuelType", transmission, type, notes, "customerId", "branchId", "createdAt", "updatedAt") FROM stdin;
cmp6ejav10001k4551zx5cb0j	ABC123	Toyota	Corolla	2018	Blanco	VIN123456789	85000	GASOLINE	AUTOMATIC	SEDAN	Vehículo en buen estado general	cmp6liuob0000jo55pvmzmsj0	\N	2026-05-15 04:13:00.734	2026-05-15 07:29:43.297
cmp6ll12d0001jo55to6vnlbx	5896-JW	Pulsar	N250	2025	Negro	\N	1	GASOLINE	MANUAL	MOTORCYCLE	\N	cmp6liuob0000jo55pvmzmsj0	\N	2026-05-15 07:30:18.661	2026-05-15 07:30:18.661
cmp72vgc300055s55zvpizm18	OPED-D1	Toyota	Supra	2021	Blanco	\N	50	GASOLINE	MANUAL	SEDAN	\N	cmp72uih700045s55q5bufrbx	\N	2026-05-15 15:34:18.483	2026-05-15 15:34:18.483
cmpcu86x700008g552ib7bitn	23219AS	CHEVROLET	Camaro	2024	Blanco	\N	1000	GASOLINE	MANUAL	OTHER	asdasdas	cmp6liuob0000jo55pvmzmsj0	\N	2026-05-19 16:18:53.323	2026-05-19 16:26:33.489
cmphq01yh0000ks55hrnmt1um	B31-196	supermoto	kawanavi	2011	negro	bvn334232342542354	10000	GASOLINE	MANUAL	MOTORCYCLE	mototaxi	cmphpjcv20003vc55ae4mdi02	\N	2026-05-23 02:19:26.057	2026-05-23 02:19:26.057
\.


--
-- Data for Name: WorkOrder; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WorkOrder" (id, code, reason, "reportedSymptoms", "initialDiagnosis", "finalDiagnosis", "internalNotes", status, priority, "receivedAt", "estimatedDelivery", "deliveredAt", "qrToken", "customerSignatureUrl", "vehicleId", "branchId", "mechanicId", "createdById", "createdAt", "updatedAt") FROM stdin;
cmp6ffpm30000rw55b9uu97k6	OT-2026-000001	Ruido fuerte al frenar	El cliente indica sonido metálico al presionar el pedal de freno	Posible desgaste de pastillas o disco de freno	\N	Priorizar revisión por seguridad	CANCELLED	HIGH	2026-05-15 04:38:12.843	2026-05-18 18:00:00	\N	89ec0bc1-50aa-4246-a70f-2ee75bd05deb	\N	cmp6ejav10001k4551zx5cb0j	\N	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 04:38:12.843	2026-05-15 07:40:31.382
cmp6lyxeh0007jo55u32i9quf	OT-2026-000002	Ruido en las pastillas	\N	Desgaste prematuro	\N	Cambiar por uno nuevo 	DELIVERED	URGENT	2026-05-15 07:41:07.097	2026-05-16 14:44:00	2026-05-15 07:43:04.592	cf27c43f-4ea9-463d-8fdc-385935ced80b	\N	cmp6ll12d0001jo55to6vnlbx	\N	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 07:41:07.097	2026-05-15 07:58:59.711
cmp72w3l300065s55cgyzv1r6	OT-2026-000003	Mantenimiento Preventivo	\N	\N	\N	\N	COMPLETED	HIGH	2026-05-15 15:34:48.615	2026-05-16 15:37:00	\N	df6f8794-dad2-4cea-9470-35c1ebb01349	\N	cmp72vgc300055s55zvpizm18	\N	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 15:34:48.615	2026-05-18 03:54:30.2
cmphh5wsh00013g55rofhp797	OT-2026-000006	Alineacion de ruedas	El vehículo se va para un costado 	El vehiculo presenta desalineacion en las 2 ruedas delantera	\N	\N	RECEIVED	MEDIUM	2026-05-22 22:12:02.754	2026-05-22 22:10:00	\N	5efb17a2-7d19-4f8c-a442-cbd921afb279	\N	cmpcu86x700008g552ib7bitn	\N	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-22 22:12:02.754	2026-05-22 22:12:02.754
cmphp8cry0000vc55kpnno048	OT-2026-000007	Choque	choque en la parte delantera del coche 	daños fuertes en el chasis 	\N	daños graves	RECEIVED	HIGH	2026-05-23 01:57:53.71	2026-05-23 01:57:00	\N	f6b9361c-a40f-4958-a2f6-95cc5a2cc278	\N	cmp72vgc300055s55zvpizm18	\N	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-23 01:57:53.71	2026-05-23 01:57:53.71
cmpaomouz0002po551vd404wp	OT-2026-000004	Mantenimiento	\N	\N	\N	\N	IN_REPAIR	HIGH	2026-05-18 04:06:39.707	2026-05-17 13:10:00	\N	35b0bd3b-43d9-453a-8d41-10ef1b3b7905	\N	cmp6ll12d0001jo55to6vnlbx	\N	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-18 04:06:39.707	2026-05-19 16:27:38.571
cmpcqv8uc0000po558aftuvau	OT-2026-000005	asdasdas	\N	\N	\N	\N	IN_TESTING	HIGH	2026-05-19 14:44:50.437	2026-05-19 21:44:00	\N	0c759c06-4f7d-43e2-b237-88d65a89ccd6	\N	cmp72vgc300055s55zvpizm18	\N	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-19 14:44:50.437	2026-05-19 16:58:07.053
cmphq2wsv0001ks55xhf8zs7l	OT-2026-000008	choque frontal de mototaxi	presenta alteracion de timon dañado circuitos electricos	timon dañado	\N	\N	RECEIVED	MEDIUM	2026-05-23 02:21:39.343	2026-05-21 02:21:00	\N	08e20e35-c0cc-409a-a916-e73b1b6ad8c3	\N	cmphq01yh0000ks55hrnmt1um	\N	\N	cmp6bwoql0008xg55wc5t1cfw	2026-05-23 02:21:39.343	2026-05-23 02:21:39.343
cmreprwtu0000vs55bfqnhw6k	OT-2026-000009	ASDASDAS	ASD	ASD	\N	ASDAS	RECEIVED	HIGH	2026-07-10 09:09:12.306	2026-07-10 15:14:00	\N	381bd81e-9102-46f2-98bd-05f9c2bbed26	\N	cmp72vgc300055s55zvpizm18	\N	\N	cmp6bwoql0008xg55wc5t1cfw	2026-07-10 09:09:12.306	2026-07-10 09:09:12.306
\.


--
-- Data for Name: WorkOrderStatusHistory; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."WorkOrderStatusHistory" (id, "oldStatus", "newStatus", notes, "workOrderId", "changedById", "createdAt") FROM stdin;
cmp6ffpnz0001rw55dop3cjpu	\N	RECEIVED	Orden creada	cmp6ffpm30000rw55b9uu97k6	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 04:38:12.911
cmp6lxdpj0002jo5523oxe1xo	RECEIVED	IN_DIAGNOSIS	Cambio de estado desde frontend: RECEIVED → IN_DIAGNOSIS	cmp6ffpm30000rw55b9uu97k6	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 07:39:54.92
cmp6lxvg70003jo558agmli30	IN_DIAGNOSIS	WAITING_APPROVAL	Cambio de estado desde frontend: IN_DIAGNOSIS → WAITING_APPROVAL	cmp6ffpm30000rw55b9uu97k6	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 07:40:17.912
cmp6lxypj0004jo553hsn5da8	WAITING_APPROVAL	IN_REPAIR	Cambio de estado desde frontend: WAITING_APPROVAL → IN_REPAIR	cmp6ffpm30000rw55b9uu97k6	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 07:40:22.135
cmp6ly3bs0005jo552699ddkj	IN_REPAIR	COMPLETED	Cambio de estado desde frontend: IN_REPAIR → COMPLETED	cmp6ffpm30000rw55b9uu97k6	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 07:40:28.12
cmp6ly5uj0006jo55eyhfnur5	COMPLETED	CANCELLED	Cambio de estado desde frontend: COMPLETED → CANCELLED	cmp6ffpm30000rw55b9uu97k6	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 07:40:31.387
cmp6lyxer0008jo559fovpbin	\N	RECEIVED	Orden creada	cmp6lyxeh0007jo55u32i9quf	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 07:41:07.107
cmp6m16gz0009jo55h8pjbb1r	RECEIVED	IN_DIAGNOSIS	Cambio de estado desde frontend: RECEIVED → IN_DIAGNOSIS	cmp6lyxeh0007jo55u32i9quf	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 07:42:52.164
cmp6m1buq000ajo5576qf2tja	IN_DIAGNOSIS	WAITING_APPROVAL	Cambio de estado desde frontend: IN_DIAGNOSIS → WAITING_APPROVAL	cmp6lyxeh0007jo55u32i9quf	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 07:42:59.138
cmp6m1g35000bjo55fmjym7rm	WAITING_APPROVAL	DELIVERED	Cambio de estado desde frontend: WAITING_APPROVAL → DELIVERED	cmp6lyxeh0007jo55u32i9quf	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 07:43:04.625
cmp72w3lb00075s558ahqubu0	\N	RECEIVED	Orden creada	cmp72w3l300065s55cgyzv1r6	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 15:34:48.623
cmp744tdt0000rc55w6aija53	RECEIVED	IN_TESTING	Cambio de estado desde frontend: RECEIVED → IN_TESTING	cmp72w3l300065s55cgyzv1r6	cmp6bwoql0008xg55wc5t1cfw	2026-05-15 16:09:34.913
cmpao72150000po55wfmc8iwb	IN_TESTING	COMPLETED	Cambio de estado desde frontend: IN_TESTING → COMPLETED	cmp72w3l300065s55cgyzv1r6	cmp6bwoql0008xg55wc5t1cfw	2026-05-18 03:54:30.283
cmpaomp000003po55ctetabut	\N	RECEIVED	Orden creada	cmpaomouz0002po551vd404wp	cmp6bwoql0008xg55wc5t1cfw	2026-05-18 04:06:39.888
cmpcqv8w60001po55yx5c2duk	\N	RECEIVED	Orden creada	cmpcqv8uc0000po558aftuvau	cmp6bwoql0008xg55wc5t1cfw	2026-05-19 14:44:50.502
cmpcqvkeg0002po55ia2ztg45	RECEIVED	IN_DIAGNOSIS	Cambio de estado desde tabla: RECEIVED → IN_DIAGNOSIS	cmpcqv8uc0000po558aftuvau	cmp6bwoql0008xg55wc5t1cfw	2026-05-19 14:45:05.416
cmpcr5mva0003po55s5ikdpz1	RECEIVED	WAITING_APPROVAL	Cambio de estado desde frontend: RECEIVED → WAITING_APPROVAL	cmpaomouz0002po551vd404wp	cmp6bwoql0008xg55wc5t1cfw	2026-05-19 14:52:55.174
cmpcrd0a10004po55bw2kkh7u	IN_DIAGNOSIS	RECEIVED	Cambio de estado desde Kanban: IN_DIAGNOSIS → RECEIVED	cmpcqv8uc0000po558aftuvau	cmp6bwoql0008xg55wc5t1cfw	2026-05-19 14:58:39.145
cmpcresq30005po55uf5itxsw	RECEIVED	PENDING	Cambio de estado desde Kanban: RECEIVED → PENDING	cmpcqv8uc0000po558aftuvau	cmp6bwoql0008xg55wc5t1cfw	2026-05-19 15:00:02.667
cmpcreu7s0006po55kfy605yk	PENDING	IN_DIAGNOSIS	Cambio de estado desde Kanban: PENDING → IN_DIAGNOSIS	cmpcqv8uc0000po558aftuvau	cmp6bwoql0008xg55wc5t1cfw	2026-05-19 15:00:04.6
cmpcrfvwl0007po55hld15bzw	IN_DIAGNOSIS	IN_REPAIR	Cambio de estado desde tabla: IN_DIAGNOSIS → IN_REPAIR	cmpcqv8uc0000po558aftuvau	cmp6bwoql0008xg55wc5t1cfw	2026-05-19 15:00:53.445
cmpcrg3i90008po5536qho600	IN_REPAIR	IN_TESTING	Cambio de estado desde Kanban: IN_REPAIR → IN_TESTING	cmpcqv8uc0000po558aftuvau	cmp6bwoql0008xg55wc5t1cfw	2026-05-19 15:01:03.297
cmpcujg7q00038g55y1sh65ml	WAITING_APPROVAL	IN_REPAIR	Cambio de estado desde Kanban: WAITING_APPROVAL → IN_REPAIR	cmpaomouz0002po551vd404wp	cmp6bwoql0008xg55wc5t1cfw	2026-05-19 16:27:38.582
cmpcvkqum00068g55i0w4svqv	IN_TESTING	IN_REPAIR	\N	cmpcqv8uc0000po558aftuvau	cmp6bwoql0008xg55wc5t1cfw	2026-05-19 16:56:38.638
cmpcvmn2z00078g55a098fmg3	IN_REPAIR	IN_TESTING	\N	cmpcqv8uc0000po558aftuvau	cmp6bwoql0008xg55wc5t1cfw	2026-05-19 16:58:07.067
cmphh5wto00023g55hslj5325	\N	RECEIVED	Orden creada	cmphh5wsh00013g55rofhp797	cmp6bwoql0008xg55wc5t1cfw	2026-05-22 22:12:02.796
cmphp8cte0001vc55j74ikmge	\N	RECEIVED	Orden creada	cmphp8cry0000vc55kpnno048	cmp6bwoql0008xg55wc5t1cfw	2026-05-23 01:57:53.762
cmphq2wu00002ks556jmqhfcv	\N	RECEIVED	Orden creada	cmphq2wsv0001ks55xhf8zs7l	cmp6bwoql0008xg55wc5t1cfw	2026-05-23 02:21:39.384
cmreprwua0001vs55fpkqlwy1	\N	RECEIVED	Orden creada	cmreprwtu0000vs55bfqnhw6k	cmp6bwoql0008xg55wc5t1cfw	2026-07-10 09:09:12.322
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
972764b8-8f6c-4442-a51e-9a08d70dbdb7	6b6ca85092e93abcf35c62226dda178bd286996cf82a1f93667aaaf5332f9717	2026-05-14 21:31:02.361054-05	20260515023102_init_mechanic_saas	\N	\N	2026-05-14 21:31:02.09615-05	1
5e0b1b88-2b95-4cbf-874a-a1b2f50e9eee	f5e3977a00c524ff081378ca7dc3a0fa524f836708eb0375020b0b72d59d33b5	2026-07-08 10:41:36.927226-05	20260708154136_add_complaint_book	\N	\N	2026-07-08 10:41:36.839157-05	1
d7eecfda-4d61-456d-87af-c02020ad72f2	8aa98c0179ff501e4b529f1c3ac211e0fbc4462adeacd8c12a0878e63b8a76b4	2026-07-15 10:58:03.370743-05	20260715155803_add_continuity_management	\N	\N	2026-07-15 10:58:03.353389-05	1
7f44481f-0195-4abf-bd2d-97adc99cc9b2	630008549fc9bee5d20c3bfe5ecbf07c519b48967402e68e8d20522c5052bfb5	2026-07-15 13:24:38.284848-05	20260715182438_add_restore_backup_audit	\N	\N	2026-07-15 13:24:38.277085-05	1
\.


--
-- Name: Appointment Appointment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointment"
    ADD CONSTRAINT "Appointment_pkey" PRIMARY KEY (id);


--
-- Name: Attachment Attachment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attachment"
    ADD CONSTRAINT "Attachment_pkey" PRIMARY KEY (id);


--
-- Name: AuditLog AuditLog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_pkey" PRIMARY KEY (id);


--
-- Name: Backup Backup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Backup"
    ADD CONSTRAINT "Backup_pkey" PRIMARY KEY (id);


--
-- Name: Branch Branch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Branch"
    ADD CONSTRAINT "Branch_pkey" PRIMARY KEY (id);


--
-- Name: CashRegister CashRegister_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CashRegister"
    ADD CONSTRAINT "CashRegister_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: Company Company_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Company"
    ADD CONSTRAINT "Company_pkey" PRIMARY KEY (id);


--
-- Name: ComplaintBookAttachment ComplaintBookAttachment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ComplaintBookAttachment"
    ADD CONSTRAINT "ComplaintBookAttachment_pkey" PRIMARY KEY (id);


--
-- Name: ComplaintBookEntry ComplaintBookEntry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ComplaintBookEntry"
    ADD CONSTRAINT "ComplaintBookEntry_pkey" PRIMARY KEY (id);


--
-- Name: ComplaintBookStatusHistory ComplaintBookStatusHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ComplaintBookStatusHistory"
    ADD CONSTRAINT "ComplaintBookStatusHistory_pkey" PRIMARY KEY (id);


--
-- Name: Customer Customer_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_pkey" PRIMARY KEY (id);


--
-- Name: Diagnostic Diagnostic_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Diagnostic"
    ADD CONSTRAINT "Diagnostic_pkey" PRIMARY KEY (id);


--
-- Name: InspectionChecklist InspectionChecklist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InspectionChecklist"
    ADD CONSTRAINT "InspectionChecklist_pkey" PRIMARY KEY (id);


--
-- Name: InventoryMovement InventoryMovement_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryMovement"
    ADD CONSTRAINT "InventoryMovement_pkey" PRIMARY KEY (id);


--
-- Name: Invoice Invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_pkey" PRIMARY KEY (id);


--
-- Name: MaintenanceReminder MaintenanceReminder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MaintenanceReminder"
    ADD CONSTRAINT "MaintenanceReminder_pkey" PRIMARY KEY (id);


--
-- Name: Notification Notification_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_pkey" PRIMARY KEY (id);


--
-- Name: Part Part_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Part"
    ADD CONSTRAINT "Part_pkey" PRIMARY KEY (id);


--
-- Name: Payment Payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_pkey" PRIMARY KEY (id);


--
-- Name: Permission Permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Permission"
    ADD CONSTRAINT "Permission_pkey" PRIMARY KEY (id);


--
-- Name: PurchaseItem PurchaseItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseItem"
    ADD CONSTRAINT "PurchaseItem_pkey" PRIMARY KEY (id);


--
-- Name: Purchase Purchase_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_pkey" PRIMARY KEY (id);


--
-- Name: QuoteItem QuoteItem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuoteItem"
    ADD CONSTRAINT "QuoteItem_pkey" PRIMARY KEY (id);


--
-- Name: Quote Quote_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Quote"
    ADD CONSTRAINT "Quote_pkey" PRIMARY KEY (id);


--
-- Name: RolePermission RolePermission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_pkey" PRIMARY KEY (id);


--
-- Name: Role Role_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Role"
    ADD CONSTRAINT "Role_pkey" PRIMARY KEY (id);


--
-- Name: Service Service_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Service"
    ADD CONSTRAINT "Service_pkey" PRIMARY KEY (id);


--
-- Name: Supplier Supplier_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Supplier"
    ADD CONSTRAINT "Supplier_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: Vehicle Vehicle_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vehicle"
    ADD CONSTRAINT "Vehicle_pkey" PRIMARY KEY (id);


--
-- Name: WorkOrderStatusHistory WorkOrderStatusHistory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkOrderStatusHistory"
    ADD CONSTRAINT "WorkOrderStatusHistory_pkey" PRIMARY KEY (id);


--
-- Name: WorkOrder WorkOrder_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkOrder"
    ADD CONSTRAINT "WorkOrder_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Appointment_branchId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Appointment_branchId_idx" ON public."Appointment" USING btree ("branchId");


--
-- Name: Appointment_customerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Appointment_customerId_idx" ON public."Appointment" USING btree ("customerId");


--
-- Name: Appointment_startAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Appointment_startAt_idx" ON public."Appointment" USING btree ("startAt");


--
-- Name: Appointment_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Appointment_status_idx" ON public."Appointment" USING btree (status);


--
-- Name: Appointment_vehicleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Appointment_vehicleId_idx" ON public."Appointment" USING btree ("vehicleId");


--
-- Name: Attachment_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Attachment_type_idx" ON public."Attachment" USING btree (type);


--
-- Name: Attachment_uploadedById_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Attachment_uploadedById_idx" ON public."Attachment" USING btree ("uploadedById");


--
-- Name: Attachment_workOrderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Attachment_workOrderId_idx" ON public."Attachment" USING btree ("workOrderId");


--
-- Name: AuditLog_action_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_action_idx" ON public."AuditLog" USING btree (action);


--
-- Name: AuditLog_companyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_companyId_idx" ON public."AuditLog" USING btree ("companyId");


--
-- Name: AuditLog_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_createdAt_idx" ON public."AuditLog" USING btree ("createdAt");


--
-- Name: AuditLog_entityId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_entityId_idx" ON public."AuditLog" USING btree ("entityId");


--
-- Name: AuditLog_module_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_module_idx" ON public."AuditLog" USING btree (module);


--
-- Name: AuditLog_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "AuditLog_userId_idx" ON public."AuditLog" USING btree ("userId");


--
-- Name: Backup_companyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Backup_companyId_idx" ON public."Backup" USING btree ("companyId");


--
-- Name: Backup_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Backup_createdAt_idx" ON public."Backup" USING btree ("createdAt");


--
-- Name: Backup_createdById_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Backup_createdById_idx" ON public."Backup" USING btree ("createdById");


--
-- Name: Backup_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Backup_status_idx" ON public."Backup" USING btree (status);


--
-- Name: Branch_companyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Branch_companyId_idx" ON public."Branch" USING btree ("companyId");


--
-- Name: Branch_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Branch_name_idx" ON public."Branch" USING btree (name);


--
-- Name: CashRegister_branchId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CashRegister_branchId_idx" ON public."CashRegister" USING btree ("branchId");


--
-- Name: CashRegister_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "CashRegister_code_key" ON public."CashRegister" USING btree (code);


--
-- Name: CashRegister_openedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CashRegister_openedAt_idx" ON public."CashRegister" USING btree ("openedAt");


--
-- Name: CashRegister_openedById_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CashRegister_openedById_idx" ON public."CashRegister" USING btree ("openedById");


--
-- Name: CashRegister_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "CashRegister_status_idx" ON public."CashRegister" USING btree (status);


--
-- Name: Comment_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Comment_userId_idx" ON public."Comment" USING btree ("userId");


--
-- Name: Comment_workOrderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Comment_workOrderId_idx" ON public."Comment" USING btree ("workOrderId");


--
-- Name: Company_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Company_name_idx" ON public."Company" USING btree (name);


--
-- Name: Company_ruc_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Company_ruc_key" ON public."Company" USING btree (ruc);


--
-- Name: ComplaintBookAttachment_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookAttachment_category_idx" ON public."ComplaintBookAttachment" USING btree (category);


--
-- Name: ComplaintBookAttachment_complaintBookEntryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookAttachment_complaintBookEntryId_idx" ON public."ComplaintBookAttachment" USING btree ("complaintBookEntryId");


--
-- Name: ComplaintBookAttachment_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookAttachment_type_idx" ON public."ComplaintBookAttachment" USING btree (type);


--
-- Name: ComplaintBookAttachment_uploadedById_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookAttachment_uploadedById_idx" ON public."ComplaintBookAttachment" USING btree ("uploadedById");


--
-- Name: ComplaintBookEntry_answeredById_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookEntry_answeredById_idx" ON public."ComplaintBookEntry" USING btree ("answeredById");


--
-- Name: ComplaintBookEntry_branchId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookEntry_branchId_idx" ON public."ComplaintBookEntry" USING btree ("branchId");


--
-- Name: ComplaintBookEntry_caseType_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookEntry_caseType_idx" ON public."ComplaintBookEntry" USING btree ("caseType");


--
-- Name: ComplaintBookEntry_claimantDocumentNumber_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookEntry_claimantDocumentNumber_idx" ON public."ComplaintBookEntry" USING btree ("claimantDocumentNumber");


--
-- Name: ComplaintBookEntry_code_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookEntry_code_idx" ON public."ComplaintBookEntry" USING btree (code);


--
-- Name: ComplaintBookEntry_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "ComplaintBookEntry_code_key" ON public."ComplaintBookEntry" USING btree (code);


--
-- Name: ComplaintBookEntry_companyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookEntry_companyId_idx" ON public."ComplaintBookEntry" USING btree ("companyId");


--
-- Name: ComplaintBookEntry_createdById_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookEntry_createdById_idx" ON public."ComplaintBookEntry" USING btree ("createdById");


--
-- Name: ComplaintBookEntry_customerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookEntry_customerId_idx" ON public."ComplaintBookEntry" USING btree ("customerId");


--
-- Name: ComplaintBookEntry_dueDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookEntry_dueDate_idx" ON public."ComplaintBookEntry" USING btree ("dueDate");


--
-- Name: ComplaintBookEntry_registeredAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookEntry_registeredAt_idx" ON public."ComplaintBookEntry" USING btree ("registeredAt");


--
-- Name: ComplaintBookEntry_responsibleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookEntry_responsibleId_idx" ON public."ComplaintBookEntry" USING btree ("responsibleId");


--
-- Name: ComplaintBookEntry_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookEntry_status_idx" ON public."ComplaintBookEntry" USING btree (status);


--
-- Name: ComplaintBookEntry_vehicleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookEntry_vehicleId_idx" ON public."ComplaintBookEntry" USING btree ("vehicleId");


--
-- Name: ComplaintBookEntry_vehiclePlate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookEntry_vehiclePlate_idx" ON public."ComplaintBookEntry" USING btree ("vehiclePlate");


--
-- Name: ComplaintBookEntry_workOrderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookEntry_workOrderId_idx" ON public."ComplaintBookEntry" USING btree ("workOrderId");


--
-- Name: ComplaintBookStatusHistory_changedById_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookStatusHistory_changedById_idx" ON public."ComplaintBookStatusHistory" USING btree ("changedById");


--
-- Name: ComplaintBookStatusHistory_complaintBookEntryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookStatusHistory_complaintBookEntryId_idx" ON public."ComplaintBookStatusHistory" USING btree ("complaintBookEntryId");


--
-- Name: ComplaintBookStatusHistory_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookStatusHistory_createdAt_idx" ON public."ComplaintBookStatusHistory" USING btree ("createdAt");


--
-- Name: ComplaintBookStatusHistory_newStatus_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "ComplaintBookStatusHistory_newStatus_idx" ON public."ComplaintBookStatusHistory" USING btree ("newStatus");


--
-- Name: Customer_branchId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Customer_branchId_idx" ON public."Customer" USING btree ("branchId");


--
-- Name: Customer_companyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Customer_companyId_idx" ON public."Customer" USING btree ("companyId");


--
-- Name: Customer_documentNumber_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Customer_documentNumber_idx" ON public."Customer" USING btree ("documentNumber");


--
-- Name: Customer_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Customer_email_idx" ON public."Customer" USING btree (email);


--
-- Name: Customer_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Customer_name_idx" ON public."Customer" USING btree (name);


--
-- Name: Customer_phone_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Customer_phone_idx" ON public."Customer" USING btree (phone);


--
-- Name: Diagnostic_mechanicId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Diagnostic_mechanicId_idx" ON public."Diagnostic" USING btree ("mechanicId");


--
-- Name: Diagnostic_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Diagnostic_type_idx" ON public."Diagnostic" USING btree (type);


--
-- Name: Diagnostic_workOrderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Diagnostic_workOrderId_idx" ON public."Diagnostic" USING btree ("workOrderId");


--
-- Name: InspectionChecklist_workOrderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "InspectionChecklist_workOrderId_idx" ON public."InspectionChecklist" USING btree ("workOrderId");


--
-- Name: InventoryMovement_branchId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "InventoryMovement_branchId_idx" ON public."InventoryMovement" USING btree ("branchId");


--
-- Name: InventoryMovement_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "InventoryMovement_createdAt_idx" ON public."InventoryMovement" USING btree ("createdAt");


--
-- Name: InventoryMovement_createdById_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "InventoryMovement_createdById_idx" ON public."InventoryMovement" USING btree ("createdById");


--
-- Name: InventoryMovement_partId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "InventoryMovement_partId_idx" ON public."InventoryMovement" USING btree ("partId");


--
-- Name: InventoryMovement_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "InventoryMovement_type_idx" ON public."InventoryMovement" USING btree (type);


--
-- Name: Invoice_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Invoice_code_key" ON public."Invoice" USING btree (code);


--
-- Name: Invoice_customerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Invoice_customerId_idx" ON public."Invoice" USING btree ("customerId");


--
-- Name: Invoice_issuedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Invoice_issuedAt_idx" ON public."Invoice" USING btree ("issuedAt");


--
-- Name: Invoice_quoteId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Invoice_quoteId_key" ON public."Invoice" USING btree ("quoteId");


--
-- Name: Invoice_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Invoice_status_idx" ON public."Invoice" USING btree (status);


--
-- Name: Invoice_workOrderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Invoice_workOrderId_idx" ON public."Invoice" USING btree ("workOrderId");


--
-- Name: MaintenanceReminder_customerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "MaintenanceReminder_customerId_idx" ON public."MaintenanceReminder" USING btree ("customerId");


--
-- Name: MaintenanceReminder_dueDate_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "MaintenanceReminder_dueDate_idx" ON public."MaintenanceReminder" USING btree ("dueDate");


--
-- Name: MaintenanceReminder_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "MaintenanceReminder_status_idx" ON public."MaintenanceReminder" USING btree (status);


--
-- Name: MaintenanceReminder_vehicleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "MaintenanceReminder_vehicleId_idx" ON public."MaintenanceReminder" USING btree ("vehicleId");


--
-- Name: Notification_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notification_createdAt_idx" ON public."Notification" USING btree ("createdAt");


--
-- Name: Notification_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notification_status_idx" ON public."Notification" USING btree (status);


--
-- Name: Notification_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notification_type_idx" ON public."Notification" USING btree (type);


--
-- Name: Notification_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Notification_userId_idx" ON public."Notification" USING btree ("userId");


--
-- Name: Part_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Part_category_idx" ON public."Part" USING btree (category);


--
-- Name: Part_code_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Part_code_idx" ON public."Part" USING btree (code);


--
-- Name: Part_companyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Part_companyId_idx" ON public."Part" USING btree ("companyId");


--
-- Name: Part_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Part_name_idx" ON public."Part" USING btree (name);


--
-- Name: Part_sku_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Part_sku_key" ON public."Part" USING btree (sku);


--
-- Name: Part_stock_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Part_stock_idx" ON public."Part" USING btree (stock);


--
-- Name: Part_supplierId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Part_supplierId_idx" ON public."Part" USING btree ("supplierId");


--
-- Name: Payment_cashRegisterId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Payment_cashRegisterId_idx" ON public."Payment" USING btree ("cashRegisterId");


--
-- Name: Payment_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Payment_code_key" ON public."Payment" USING btree (code);


--
-- Name: Payment_customerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Payment_customerId_idx" ON public."Payment" USING btree ("customerId");


--
-- Name: Payment_invoiceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Payment_invoiceId_idx" ON public."Payment" USING btree ("invoiceId");


--
-- Name: Payment_method_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Payment_method_idx" ON public."Payment" USING btree (method);


--
-- Name: Payment_paidAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Payment_paidAt_idx" ON public."Payment" USING btree ("paidAt");


--
-- Name: Payment_receivedById_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Payment_receivedById_idx" ON public."Payment" USING btree ("receivedById");


--
-- Name: Permission_action_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Permission_action_idx" ON public."Permission" USING btree (action);


--
-- Name: Permission_module_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Permission_module_idx" ON public."Permission" USING btree (module);


--
-- Name: Permission_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Permission_name_key" ON public."Permission" USING btree (name);


--
-- Name: PurchaseItem_partId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PurchaseItem_partId_idx" ON public."PurchaseItem" USING btree ("partId");


--
-- Name: PurchaseItem_purchaseId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "PurchaseItem_purchaseId_idx" ON public."PurchaseItem" USING btree ("purchaseId");


--
-- Name: Purchase_branchId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Purchase_branchId_idx" ON public."Purchase" USING btree ("branchId");


--
-- Name: Purchase_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Purchase_code_key" ON public."Purchase" USING btree (code);


--
-- Name: Purchase_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Purchase_createdAt_idx" ON public."Purchase" USING btree ("createdAt");


--
-- Name: Purchase_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Purchase_status_idx" ON public."Purchase" USING btree (status);


--
-- Name: Purchase_supplierId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Purchase_supplierId_idx" ON public."Purchase" USING btree ("supplierId");


--
-- Name: QuoteItem_partId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "QuoteItem_partId_idx" ON public."QuoteItem" USING btree ("partId");


--
-- Name: QuoteItem_quoteId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "QuoteItem_quoteId_idx" ON public."QuoteItem" USING btree ("quoteId");


--
-- Name: QuoteItem_serviceId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "QuoteItem_serviceId_idx" ON public."QuoteItem" USING btree ("serviceId");


--
-- Name: QuoteItem_type_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "QuoteItem_type_idx" ON public."QuoteItem" USING btree (type);


--
-- Name: Quote_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Quote_code_key" ON public."Quote" USING btree (code);


--
-- Name: Quote_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Quote_createdAt_idx" ON public."Quote" USING btree ("createdAt");


--
-- Name: Quote_customerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Quote_customerId_idx" ON public."Quote" USING btree ("customerId");


--
-- Name: Quote_publicToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Quote_publicToken_key" ON public."Quote" USING btree ("publicToken");


--
-- Name: Quote_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Quote_status_idx" ON public."Quote" USING btree (status);


--
-- Name: Quote_vehicleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Quote_vehicleId_idx" ON public."Quote" USING btree ("vehicleId");


--
-- Name: Quote_workOrderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Quote_workOrderId_idx" ON public."Quote" USING btree ("workOrderId");


--
-- Name: RolePermission_permissionId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RolePermission_permissionId_idx" ON public."RolePermission" USING btree ("permissionId");


--
-- Name: RolePermission_roleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "RolePermission_roleId_idx" ON public."RolePermission" USING btree ("roleId");


--
-- Name: RolePermission_roleId_permissionId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON public."RolePermission" USING btree ("roleId", "permissionId");


--
-- Name: Role_name_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Role_name_key" ON public."Role" USING btree (name);


--
-- Name: Service_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Service_category_idx" ON public."Service" USING btree (category);


--
-- Name: Service_companyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Service_companyId_idx" ON public."Service" USING btree ("companyId");


--
-- Name: Service_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Service_name_idx" ON public."Service" USING btree (name);


--
-- Name: Supplier_companyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Supplier_companyId_idx" ON public."Supplier" USING btree ("companyId");


--
-- Name: Supplier_name_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Supplier_name_idx" ON public."Supplier" USING btree (name);


--
-- Name: Supplier_ruc_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Supplier_ruc_idx" ON public."Supplier" USING btree (ruc);


--
-- Name: User_branchId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_branchId_idx" ON public."User" USING btree ("branchId");


--
-- Name: User_companyId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_companyId_idx" ON public."User" USING btree ("companyId");


--
-- Name: User_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_email_idx" ON public."User" USING btree (email);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_roleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "User_roleId_idx" ON public."User" USING btree ("roleId");


--
-- Name: Vehicle_branchId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Vehicle_branchId_idx" ON public."Vehicle" USING btree ("branchId");


--
-- Name: Vehicle_brand_model_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Vehicle_brand_model_idx" ON public."Vehicle" USING btree (brand, model);


--
-- Name: Vehicle_customerId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Vehicle_customerId_idx" ON public."Vehicle" USING btree ("customerId");


--
-- Name: Vehicle_plate_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "Vehicle_plate_key" ON public."Vehicle" USING btree (plate);


--
-- Name: Vehicle_vin_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "Vehicle_vin_idx" ON public."Vehicle" USING btree (vin);


--
-- Name: WorkOrderStatusHistory_changedById_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WorkOrderStatusHistory_changedById_idx" ON public."WorkOrderStatusHistory" USING btree ("changedById");


--
-- Name: WorkOrderStatusHistory_newStatus_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WorkOrderStatusHistory_newStatus_idx" ON public."WorkOrderStatusHistory" USING btree ("newStatus");


--
-- Name: WorkOrderStatusHistory_workOrderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WorkOrderStatusHistory_workOrderId_idx" ON public."WorkOrderStatusHistory" USING btree ("workOrderId");


--
-- Name: WorkOrder_branchId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WorkOrder_branchId_idx" ON public."WorkOrder" USING btree ("branchId");


--
-- Name: WorkOrder_code_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "WorkOrder_code_key" ON public."WorkOrder" USING btree (code);


--
-- Name: WorkOrder_createdById_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WorkOrder_createdById_idx" ON public."WorkOrder" USING btree ("createdById");


--
-- Name: WorkOrder_mechanicId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WorkOrder_mechanicId_idx" ON public."WorkOrder" USING btree ("mechanicId");


--
-- Name: WorkOrder_priority_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WorkOrder_priority_idx" ON public."WorkOrder" USING btree (priority);


--
-- Name: WorkOrder_qrToken_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "WorkOrder_qrToken_key" ON public."WorkOrder" USING btree ("qrToken");


--
-- Name: WorkOrder_receivedAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WorkOrder_receivedAt_idx" ON public."WorkOrder" USING btree ("receivedAt");


--
-- Name: WorkOrder_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WorkOrder_status_idx" ON public."WorkOrder" USING btree (status);


--
-- Name: WorkOrder_vehicleId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "WorkOrder_vehicleId_idx" ON public."WorkOrder" USING btree ("vehicleId");


--
-- Name: Appointment Appointment_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointment"
    ADD CONSTRAINT "Appointment_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Appointment Appointment_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointment"
    ADD CONSTRAINT "Appointment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Appointment Appointment_vehicleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Appointment"
    ADD CONSTRAINT "Appointment_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES public."Vehicle"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Attachment Attachment_uploadedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attachment"
    ADD CONSTRAINT "Attachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Attachment Attachment_workOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Attachment"
    ADD CONSTRAINT "Attachment_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES public."WorkOrder"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: AuditLog AuditLog_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: AuditLog AuditLog_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AuditLog"
    ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Backup Backup_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Backup"
    ADD CONSTRAINT "Backup_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Backup Backup_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Backup"
    ADD CONSTRAINT "Backup_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Branch Branch_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Branch"
    ADD CONSTRAINT "Branch_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: CashRegister CashRegister_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CashRegister"
    ADD CONSTRAINT "CashRegister_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: CashRegister CashRegister_openedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CashRegister"
    ADD CONSTRAINT "CashRegister_openedById_fkey" FOREIGN KEY ("openedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_workOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES public."WorkOrder"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ComplaintBookAttachment ComplaintBookAttachment_complaintBookEntryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ComplaintBookAttachment"
    ADD CONSTRAINT "ComplaintBookAttachment_complaintBookEntryId_fkey" FOREIGN KEY ("complaintBookEntryId") REFERENCES public."ComplaintBookEntry"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ComplaintBookAttachment ComplaintBookAttachment_uploadedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ComplaintBookAttachment"
    ADD CONSTRAINT "ComplaintBookAttachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ComplaintBookEntry ComplaintBookEntry_answeredById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ComplaintBookEntry"
    ADD CONSTRAINT "ComplaintBookEntry_answeredById_fkey" FOREIGN KEY ("answeredById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ComplaintBookEntry ComplaintBookEntry_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ComplaintBookEntry"
    ADD CONSTRAINT "ComplaintBookEntry_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ComplaintBookEntry ComplaintBookEntry_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ComplaintBookEntry"
    ADD CONSTRAINT "ComplaintBookEntry_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ComplaintBookEntry ComplaintBookEntry_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ComplaintBookEntry"
    ADD CONSTRAINT "ComplaintBookEntry_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ComplaintBookEntry ComplaintBookEntry_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ComplaintBookEntry"
    ADD CONSTRAINT "ComplaintBookEntry_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ComplaintBookEntry ComplaintBookEntry_responsibleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ComplaintBookEntry"
    ADD CONSTRAINT "ComplaintBookEntry_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ComplaintBookEntry ComplaintBookEntry_vehicleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ComplaintBookEntry"
    ADD CONSTRAINT "ComplaintBookEntry_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES public."Vehicle"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ComplaintBookEntry ComplaintBookEntry_workOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ComplaintBookEntry"
    ADD CONSTRAINT "ComplaintBookEntry_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES public."WorkOrder"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ComplaintBookStatusHistory ComplaintBookStatusHistory_changedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ComplaintBookStatusHistory"
    ADD CONSTRAINT "ComplaintBookStatusHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ComplaintBookStatusHistory ComplaintBookStatusHistory_complaintBookEntryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."ComplaintBookStatusHistory"
    ADD CONSTRAINT "ComplaintBookStatusHistory_complaintBookEntryId_fkey" FOREIGN KEY ("complaintBookEntryId") REFERENCES public."ComplaintBookEntry"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Customer Customer_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Customer Customer_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Customer"
    ADD CONSTRAINT "Customer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Diagnostic Diagnostic_mechanicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Diagnostic"
    ADD CONSTRAINT "Diagnostic_mechanicId_fkey" FOREIGN KEY ("mechanicId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Diagnostic Diagnostic_workOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Diagnostic"
    ADD CONSTRAINT "Diagnostic_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES public."WorkOrder"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InspectionChecklist InspectionChecklist_workOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InspectionChecklist"
    ADD CONSTRAINT "InspectionChecklist_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES public."WorkOrder"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: InventoryMovement InventoryMovement_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryMovement"
    ADD CONSTRAINT "InventoryMovement_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: InventoryMovement InventoryMovement_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryMovement"
    ADD CONSTRAINT "InventoryMovement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: InventoryMovement InventoryMovement_partId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."InventoryMovement"
    ADD CONSTRAINT "InventoryMovement_partId_fkey" FOREIGN KEY ("partId") REFERENCES public."Part"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Invoice Invoice_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Invoice Invoice_quoteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES public."Quote"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Invoice Invoice_workOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Invoice"
    ADD CONSTRAINT "Invoice_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES public."WorkOrder"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: MaintenanceReminder MaintenanceReminder_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MaintenanceReminder"
    ADD CONSTRAINT "MaintenanceReminder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: MaintenanceReminder MaintenanceReminder_vehicleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."MaintenanceReminder"
    ADD CONSTRAINT "MaintenanceReminder_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES public."Vehicle"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Notification Notification_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Notification"
    ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Part Part_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Part"
    ADD CONSTRAINT "Part_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Part Part_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Part"
    ADD CONSTRAINT "Part_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public."Supplier"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Payment Payment_cashRegisterId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_cashRegisterId_fkey" FOREIGN KEY ("cashRegisterId") REFERENCES public."CashRegister"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Payment Payment_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Payment Payment_invoiceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES public."Invoice"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Payment Payment_receivedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Payment"
    ADD CONSTRAINT "Payment_receivedById_fkey" FOREIGN KEY ("receivedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: PurchaseItem PurchaseItem_partId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseItem"
    ADD CONSTRAINT "PurchaseItem_partId_fkey" FOREIGN KEY ("partId") REFERENCES public."Part"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: PurchaseItem PurchaseItem_purchaseId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."PurchaseItem"
    ADD CONSTRAINT "PurchaseItem_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES public."Purchase"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Purchase Purchase_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Purchase Purchase_supplierId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Purchase"
    ADD CONSTRAINT "Purchase_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES public."Supplier"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: QuoteItem QuoteItem_partId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuoteItem"
    ADD CONSTRAINT "QuoteItem_partId_fkey" FOREIGN KEY ("partId") REFERENCES public."Part"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: QuoteItem QuoteItem_quoteId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuoteItem"
    ADD CONSTRAINT "QuoteItem_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES public."Quote"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: QuoteItem QuoteItem_serviceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."QuoteItem"
    ADD CONSTRAINT "QuoteItem_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES public."Service"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Quote Quote_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Quote"
    ADD CONSTRAINT "Quote_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Quote Quote_vehicleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Quote"
    ADD CONSTRAINT "Quote_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES public."Vehicle"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Quote Quote_workOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Quote"
    ADD CONSTRAINT "Quote_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES public."WorkOrder"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: RolePermission RolePermission_permissionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES public."Permission"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RolePermission RolePermission_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."RolePermission"
    ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Service Service_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Service"
    ADD CONSTRAINT "Service_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Supplier Supplier_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Supplier"
    ADD CONSTRAINT "Supplier_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: User User_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: User User_companyId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES public."Company"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: User User_roleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES public."Role"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Vehicle Vehicle_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vehicle"
    ADD CONSTRAINT "Vehicle_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Vehicle Vehicle_customerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Vehicle"
    ADD CONSTRAINT "Vehicle_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES public."Customer"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WorkOrderStatusHistory WorkOrderStatusHistory_changedById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkOrderStatusHistory"
    ADD CONSTRAINT "WorkOrderStatusHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: WorkOrderStatusHistory WorkOrderStatusHistory_workOrderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkOrderStatusHistory"
    ADD CONSTRAINT "WorkOrderStatusHistory_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES public."WorkOrder"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WorkOrder WorkOrder_branchId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkOrder"
    ADD CONSTRAINT "WorkOrder_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES public."Branch"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: WorkOrder WorkOrder_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkOrder"
    ADD CONSTRAINT "WorkOrder_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: WorkOrder WorkOrder_mechanicId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkOrder"
    ADD CONSTRAINT "WorkOrder_mechanicId_fkey" FOREIGN KEY ("mechanicId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: WorkOrder WorkOrder_vehicleId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."WorkOrder"
    ADD CONSTRAINT "WorkOrder_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES public."Vehicle"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict cVxXvIb1NXy0ZqRMqHkSPlYRY5vRTMoXgFH9rt960RYTEwg3T6dvLzkEqUcmdse

