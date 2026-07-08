-- CreateEnum
CREATE TYPE "ComplaintDocumentType" AS ENUM ('DNI', 'CE', 'RUC', 'PASSPORT', 'OTHER');

-- CreateEnum
CREATE TYPE "ComplaintGoodType" AS ENUM ('PRODUCT', 'SERVICE', 'PART', 'OTHER');

-- CreateEnum
CREATE TYPE "ComplaintCaseType" AS ENUM ('CLAIM', 'COMPLAINT');

-- CreateEnum
CREATE TYPE "ComplaintResponseMethod" AS ENUM ('EMAIL', 'PHONE', 'WHATSAPP', 'IN_PERSON');

-- CreateEnum
CREATE TYPE "ComplaintBookStatus" AS ENUM ('REGISTERED', 'UNDER_REVIEW', 'ANSWERED', 'CLOSED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ComplaintAttachmentCategory" AS ENUM ('CUSTOMER_EVIDENCE', 'PROVIDER_RESPONSE', 'INTERNAL');

-- CreateTable
CREATE TABLE "ComplaintBookEntry" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "physicalSheetNumber" TEXT,
    "companyId" TEXT,
    "branchId" TEXT,
    "customerId" TEXT,
    "vehicleId" TEXT,
    "workOrderId" TEXT,
    "claimantType" "CustomerType" NOT NULL DEFAULT 'NATURAL',
    "claimantName" TEXT NOT NULL,
    "claimantDocumentType" "ComplaintDocumentType" NOT NULL DEFAULT 'DNI',
    "claimantDocumentNumber" TEXT NOT NULL,
    "claimantAddress" TEXT,
    "claimantPhone" TEXT,
    "claimantEmail" TEXT,
    "isMinor" BOOLEAN NOT NULL DEFAULT false,
    "guardianName" TEXT,
    "guardianDocumentType" "ComplaintDocumentType",
    "guardianDocumentNumber" TEXT,
    "guardianAddress" TEXT,
    "guardianPhone" TEXT,
    "guardianEmail" TEXT,
    "goodType" "ComplaintGoodType" NOT NULL,
    "claimedAmount" DECIMAL(12,2),
    "goodDescription" TEXT NOT NULL,
    "serviceOrderCode" TEXT,
    "vehiclePlate" TEXT,
    "vehicleBrand" TEXT,
    "vehicleModel" TEXT,
    "serviceDate" TIMESTAMP(3),
    "paymentDocument" TEXT,
    "caseType" "ComplaintCaseType" NOT NULL,
    "detail" TEXT NOT NULL,
    "customerRequest" TEXT NOT NULL,
    "responseMethod" "ComplaintResponseMethod",
    "providerObservation" TEXT,
    "actionsTaken" TEXT,
    "responseDetail" TEXT,
    "status" "ComplaintBookStatus" NOT NULL DEFAULT 'REGISTERED',
    "createdById" TEXT,
    "responsibleId" TEXT,
    "answeredById" TEXT,
    "registeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" TIMESTAMP(3),
    "answeredAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "acceptedDeclaration" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComplaintBookEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplaintBookAttachment" (
    "id" TEXT NOT NULL,
    "complaintBookEntryId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT,
    "size" INTEGER,
    "type" "AttachmentType" NOT NULL DEFAULT 'OTHER',
    "category" "ComplaintAttachmentCategory" NOT NULL DEFAULT 'CUSTOMER_EVIDENCE',
    "uploadedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComplaintBookAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplaintBookStatusHistory" (
    "id" TEXT NOT NULL,
    "complaintBookEntryId" TEXT NOT NULL,
    "oldStatus" "ComplaintBookStatus",
    "newStatus" "ComplaintBookStatus" NOT NULL,
    "comment" TEXT,
    "changedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ComplaintBookStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ComplaintBookEntry_code_key" ON "ComplaintBookEntry"("code");

-- CreateIndex
CREATE INDEX "ComplaintBookEntry_companyId_idx" ON "ComplaintBookEntry"("companyId");

-- CreateIndex
CREATE INDEX "ComplaintBookEntry_branchId_idx" ON "ComplaintBookEntry"("branchId");

-- CreateIndex
CREATE INDEX "ComplaintBookEntry_customerId_idx" ON "ComplaintBookEntry"("customerId");

-- CreateIndex
CREATE INDEX "ComplaintBookEntry_vehicleId_idx" ON "ComplaintBookEntry"("vehicleId");

-- CreateIndex
CREATE INDEX "ComplaintBookEntry_workOrderId_idx" ON "ComplaintBookEntry"("workOrderId");

-- CreateIndex
CREATE INDEX "ComplaintBookEntry_createdById_idx" ON "ComplaintBookEntry"("createdById");

-- CreateIndex
CREATE INDEX "ComplaintBookEntry_responsibleId_idx" ON "ComplaintBookEntry"("responsibleId");

-- CreateIndex
CREATE INDEX "ComplaintBookEntry_answeredById_idx" ON "ComplaintBookEntry"("answeredById");

-- CreateIndex
CREATE INDEX "ComplaintBookEntry_code_idx" ON "ComplaintBookEntry"("code");

-- CreateIndex
CREATE INDEX "ComplaintBookEntry_status_idx" ON "ComplaintBookEntry"("status");

-- CreateIndex
CREATE INDEX "ComplaintBookEntry_caseType_idx" ON "ComplaintBookEntry"("caseType");

-- CreateIndex
CREATE INDEX "ComplaintBookEntry_claimantDocumentNumber_idx" ON "ComplaintBookEntry"("claimantDocumentNumber");

-- CreateIndex
CREATE INDEX "ComplaintBookEntry_vehiclePlate_idx" ON "ComplaintBookEntry"("vehiclePlate");

-- CreateIndex
CREATE INDEX "ComplaintBookEntry_registeredAt_idx" ON "ComplaintBookEntry"("registeredAt");

-- CreateIndex
CREATE INDEX "ComplaintBookEntry_dueDate_idx" ON "ComplaintBookEntry"("dueDate");

-- CreateIndex
CREATE INDEX "ComplaintBookAttachment_complaintBookEntryId_idx" ON "ComplaintBookAttachment"("complaintBookEntryId");

-- CreateIndex
CREATE INDEX "ComplaintBookAttachment_uploadedById_idx" ON "ComplaintBookAttachment"("uploadedById");

-- CreateIndex
CREATE INDEX "ComplaintBookAttachment_type_idx" ON "ComplaintBookAttachment"("type");

-- CreateIndex
CREATE INDEX "ComplaintBookAttachment_category_idx" ON "ComplaintBookAttachment"("category");

-- CreateIndex
CREATE INDEX "ComplaintBookStatusHistory_complaintBookEntryId_idx" ON "ComplaintBookStatusHistory"("complaintBookEntryId");

-- CreateIndex
CREATE INDEX "ComplaintBookStatusHistory_changedById_idx" ON "ComplaintBookStatusHistory"("changedById");

-- CreateIndex
CREATE INDEX "ComplaintBookStatusHistory_newStatus_idx" ON "ComplaintBookStatusHistory"("newStatus");

-- CreateIndex
CREATE INDEX "ComplaintBookStatusHistory_createdAt_idx" ON "ComplaintBookStatusHistory"("createdAt");

-- AddForeignKey
ALTER TABLE "ComplaintBookEntry" ADD CONSTRAINT "ComplaintBookEntry_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintBookEntry" ADD CONSTRAINT "ComplaintBookEntry_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintBookEntry" ADD CONSTRAINT "ComplaintBookEntry_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintBookEntry" ADD CONSTRAINT "ComplaintBookEntry_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintBookEntry" ADD CONSTRAINT "ComplaintBookEntry_workOrderId_fkey" FOREIGN KEY ("workOrderId") REFERENCES "WorkOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintBookEntry" ADD CONSTRAINT "ComplaintBookEntry_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintBookEntry" ADD CONSTRAINT "ComplaintBookEntry_responsibleId_fkey" FOREIGN KEY ("responsibleId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintBookEntry" ADD CONSTRAINT "ComplaintBookEntry_answeredById_fkey" FOREIGN KEY ("answeredById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintBookAttachment" ADD CONSTRAINT "ComplaintBookAttachment_complaintBookEntryId_fkey" FOREIGN KEY ("complaintBookEntryId") REFERENCES "ComplaintBookEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintBookAttachment" ADD CONSTRAINT "ComplaintBookAttachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintBookStatusHistory" ADD CONSTRAINT "ComplaintBookStatusHistory_complaintBookEntryId_fkey" FOREIGN KEY ("complaintBookEntryId") REFERENCES "ComplaintBookEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComplaintBookStatusHistory" ADD CONSTRAINT "ComplaintBookStatusHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
