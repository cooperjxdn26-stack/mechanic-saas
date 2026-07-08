import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import {
  ComplaintCaseType,
  ComplaintDocumentType,
  ComplaintGoodType,
  ComplaintResponseMethod,
  CustomerType,
} from '../../../generated/prisma/enums';

export class CreateComplaintBookEntryDto {
  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  @IsOptional()
  @IsString()
  vehicleId?: string;

  @IsOptional()
  @IsString()
  workOrderId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  physicalSheetNumber?: string;

  // 1. Identificación del consumidor reclamante

  @IsOptional()
  @IsEnum(CustomerType)
  claimantType?: CustomerType;

  @IsString()
  @IsNotEmpty()
  claimantName!: string;

  @IsOptional()
  @IsEnum(ComplaintDocumentType)
  claimantDocumentType?: ComplaintDocumentType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  claimantDocumentNumber!: string;

  @IsOptional()
  @IsString()
  claimantAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  claimantPhone?: string;

  @IsOptional()
  @IsEmail()
  claimantEmail?: string;

  // Datos del padre, madre o apoderado

  @IsOptional()
  @IsBoolean()
  isMinor?: boolean;

  @IsOptional()
  @IsString()
  guardianName?: string;

  @IsOptional()
  @IsEnum(ComplaintDocumentType)
  guardianDocumentType?: ComplaintDocumentType;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  guardianDocumentNumber?: string;

  @IsOptional()
  @IsString()
  guardianAddress?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  guardianPhone?: string;

  @IsOptional()
  @IsEmail()
  guardianEmail?: string;

  // 2. Identificación del bien contratado

  @IsEnum(ComplaintGoodType)
  goodType!: ComplaintGoodType;

  @IsOptional()
  @IsNumber()
  claimedAmount?: number;

  @IsString()
  @IsNotEmpty()
  goodDescription!: string;

  // Datos adaptados al taller mecánico

  @IsOptional()
  @IsString()
  serviceOrderCode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  vehiclePlate?: string;

  @IsOptional()
  @IsString()
  vehicleBrand?: string;

  @IsOptional()
  @IsString()
  vehicleModel?: string;

  @IsOptional()
  @IsDateString()
  serviceDate?: string;

  @IsOptional()
  @IsString()
  paymentDocument?: string;

  // 3. Detalle de la reclamación

  @IsEnum(ComplaintCaseType)
  caseType!: ComplaintCaseType;

  @IsString()
  @IsNotEmpty()
  detail!: string;

  @IsString()
  @IsNotEmpty()
  customerRequest!: string;

  @IsOptional()
  @IsEnum(ComplaintResponseMethod)
  responseMethod?: ComplaintResponseMethod;

  @IsOptional()
  @IsBoolean()
  acceptedDeclaration?: boolean;

  @IsOptional()
  @IsString()
  createdById?: string;
}
