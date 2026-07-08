import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateSupplierDto {
  /*
   * Nombre o razón social del proveedor.
   */
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  ruc?: string;

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
   * Persona de contacto dentro del proveedor.
   */
  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  companyId?: string;
}
