import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PurchaseStatus } from '@prisma/client';

class CreatePurchaseItemDto {
  /*
   * Repuesto comprado.
   */
  @IsString()
  partId!: string;

  /*
   * Cantidad comprada.
   */
  @IsNumber()
  @Min(1)
  quantity!: number;

  /*
   * Precio unitario de compra.
   */
  @IsNumber()
  @Min(0)
  unitPrice!: number;
}

export class CreatePurchaseDto {
  /*
   * Estado inicial de la compra.
   * DRAFT: borrador
   * ORDERED: pedido realizado
   * RECEIVED: recibido y entra a stock
   * CANCELLED: cancelado
   */
  @IsOptional()
  @IsEnum(PurchaseStatus)
  status?: PurchaseStatus;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tax?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  supplierId?: string;

  @IsOptional()
  @IsString()
  branchId?: string;

  /*
   * Lista de repuestos comprados.
   */
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePurchaseItemDto)
  items!: CreatePurchaseItemDto[];
}
