import { IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { AuditAction } from '../../../generated/prisma/client';

export class CreateAuditLogDto {
  /*
   * Acción realizada:
   * CREATE, UPDATE, DELETE, LOGIN, PAYMENT, STATUS_CHANGE, etc.
   */
  @IsEnum(AuditAction)
  action!: AuditAction;

  /*
   * Módulo afectado:
   * customers, vehicles, work-orders, payments, etc.
   */
  @IsString()
  module!: string;

  /*
   * Entidad afectada.
   * Ejemplo: WorkOrder, Customer, Payment.
   */
  @IsOptional()
  @IsString()
  entity?: string;

  /*
   * ID de la entidad afectada.
   */
  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsString()
  description?: string;

  /*
   * Datos adicionales.
   * Ejemplo: valores anteriores y nuevos.
   */
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}
