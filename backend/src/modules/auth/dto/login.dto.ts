import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  /*
   * Correo del usuario.
   */
  @IsEmail({}, { message: 'El correo no es válido' })
  email!: string;

  /*
   * Password del usuario.
   */
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener mínimo 6 caracteres' })
  password!: string;
}
