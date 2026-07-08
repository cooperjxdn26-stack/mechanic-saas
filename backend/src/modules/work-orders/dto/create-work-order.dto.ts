import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { WorkOrderPriority, WorkOrderStatus } from '@prisma/client';

export class CreateWorkOrderDto {
  /*
   * Motivo principal de ingreso del vehículo.
   * Ejemplo: "Ruido en motor", "Mantenimiento preventivo", "Falla eléctrica".
   */
  @IsString()
  reason!: string;

  /*
   * Síntomas reportados por el cliente.
   * Esto ayuda al mecánico antes del diagnóstico.
   */
  @IsOptional()
  @IsString()
  reportedSymptoms?: string;

  /*
   * Diagnóstico inicial de recepción.
   */
  @IsOptional()
  @IsString()
  initialDiagnosis?: string;

  /*
   * Observaciones internas visibles solo para el equipo del taller.
   */
  @IsOptional()
  @IsString()
  internalNotes?: string;

  /*
   * Estado inicial.
   * Normalmente será RECEIVED o PENDING.
   */
  @IsOptional()
  @IsEnum(WorkOrderStatus)
  status?: WorkOrderStatus;

  /*
   * Prioridad operativa de la orden.
   */
  @IsOptional()
  @IsEnum(WorkOrderPriority)
  priority?: WorkOrderPriority;

  /*
   * Fecha estimada de entrega.
   */
  @IsOptional()
  @IsDateString()
  estimatedDelivery?: string;

  /*
   * Vehículo asociado a la orden.
   */
  @IsString()
  vehicleId!: string;

  /*
   * Mecánico responsable.
   * Puede asignarse al crear o después.
   */
  @IsOptional()
  @IsString()
  mechanicId?: string;

  /*
   * Sucursal donde se atenderá.
   */
  @IsOptional()
  @IsString()
  branchId?: string;
}
