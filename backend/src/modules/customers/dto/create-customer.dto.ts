import {
  IsArray,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CustomerStatus, CustomerType } from '@prisma/client';

export class CreateCustomerDto {
  /*
   * Tipo de cliente:
   * NATURAL = persona
   * COMPANY = empresa
   */
  @IsOptional()
  @IsEnum(CustomerType)
  type?: CustomerType;

  /*
   * Estado comercial del cliente:
   * ACTIVE, INACTIVE, VIP, DEBTOR
   */
  @IsOptional()
  @IsEnum(CustomerStatus)
  status?: CustomerStatus;

  /*
   * Nombre completo o razón social.
   */
  @IsString()
  name!: string;

  /*
   * DNI, RUC, pasaporte u otro identificador.
   */
  @IsOptional()
  @IsString()
  documentNumber?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'El correo no tiene un formato válido' })
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  /*
   * Observaciones internas del taller sobre este cliente.
   */
  @IsOptional()
  @IsString()
  notes?: string;

  /*
   * Etiquetas útiles para segmentar:
   * VIP, flotilla, taxi, corporativo, frecuente, urgente, etc.
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  /*
   * Nivel de confianza interno.
   * Puede usarse después para crédito, deuda o prioridad.
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  trustLevel?: number;

  /*
   * Empresa y sucursal para soportar SaaS / multiempresa.
   */
  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  branchId?: string;
}
