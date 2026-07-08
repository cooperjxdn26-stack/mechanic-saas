import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { InventoryMovementType } from '@prisma/client';

export class InventoryMovementDto {
  /*
   * Tipo de movimiento:
   * IN = entrada
   * OUT = salida
   * ADJUSTMENT = ajuste
   * RETURN = devolución
   * LOSS = pérdida
   */
  @IsEnum(InventoryMovementType)
  type!: InventoryMovementType;

  /*
   * Cantidad del movimiento.
   */
  @IsInt()
  @Min(1)
  quantity!: number;

  /*
   * Motivo del movimiento.
   */
  @IsOptional()
  @IsString()
  reason?: string;

  /*
   * Referencia externa.
   * Ejemplo: COMPRA-001, AJUSTE-MANUAL, OT-2026-000001.
   */
  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  branchId?: string;
}
