import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuoteItemType, QuoteStatus } from '@prisma/client';

class CreateQuoteItemDto {
  /*
   * Tipo de item:
   * SERVICE = servicio registrado
   * PART = repuesto registrado
   * LABOR = mano de obra
   * EXTRA = cualquier cargo adicional
   */
  @IsEnum(QuoteItemType)
  type!: QuoteItemType;

  /*
   * Descripción visible en la cotización.
   */
  @IsString()
  description!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsNumber()
  @Min(0)
  unitPrice!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  /*
   * Si el item es SERVICE, puede asociarse al catálogo de servicios.
   */
  @IsOptional()
  @IsString()
  serviceId?: string;

  /*
   * Si el item es PART, puede asociarse a un repuesto.
   */
  @IsOptional()
  @IsString()
  partId?: string;
}

export class CreateQuoteDto {
  /*
   * Estado inicial.
   * Normalmente DRAFT o SENT.
   */
  @IsOptional()
  @IsEnum(QuoteStatus)
  status?: QuoteStatus;

  /*
   * Descuento global de la cotización.
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  /*
   * Impuesto global.
   * Ejemplo: IGV.
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  tax?: number;

  /*
   * Fecha de vencimiento de la cotización.
   */
  @IsOptional()
  @IsDateString()
  validUntil?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  /*
   * Cliente obligatorio.
   */
  @IsString()
  customerId!: string;

  /*
   * Vehículo opcional, pero recomendable.
   */
  @IsOptional()
  @IsString()
  vehicleId?: string;

  /*
   * Si la cotización nace desde una orden de trabajo.
   */
  @IsOptional()
  @IsString()
  workOrderId?: string;

  /*
   * Items de la cotización.
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuoteItemDto)
  items!: CreateQuoteItemDto[];
}
