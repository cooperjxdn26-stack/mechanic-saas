import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

/*
 * PartialType convierte todos los campos de CreateUserDto en opcionales.
 * Perfecto para PATCH /users/:id.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
