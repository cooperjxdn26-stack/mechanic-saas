import { IsEnum, IsOptional, IsString } from 'class-validator';
import { WorkOrderStatus } from '@prisma/client';

export class ChangeWorkOrderStatusDto {
  /*
   * Nuevo estado de la orden.
   */
  @IsEnum(WorkOrderStatus)
  status!: WorkOrderStatus;

  /*
   * Nota opcional para explicar el cambio.
   * Ejemplo: "Cliente aprobó cotización", "Se inició diagnóstico".
   */
  @IsOptional()
  @IsString()
  notes?: string;
}
