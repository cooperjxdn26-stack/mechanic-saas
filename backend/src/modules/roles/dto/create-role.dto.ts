import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del rol es obligatorio' })
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  /*
   * isSystem sirve para marcar roles base del sistema.
   */
  @IsOptional()
  @IsBoolean()
  isSystem?: boolean;
}
