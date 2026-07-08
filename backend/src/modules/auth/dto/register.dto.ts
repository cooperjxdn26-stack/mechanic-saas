import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  /*
   * Nombre del usuario.
   */
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  firstName!: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  lastName!: string;

  @IsEmail({}, { message: 'El correo no es válido' })
  email!: string;

  /*
   * Contraseña del usuario.
   */
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener mínimo 6 caracteres' })
  password!: string;

  /*
   * Teléfono del usuario.
   */
  @IsOptional()
  @IsString()
  phone?: string;

  /*
   * Opcional porque en algunos casos el usuario puede crearse
   * después de seleccionar empresa/sucursal.
   */
  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @IsString()
  roleId?: string;
}
