import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerDto } from './create-customer.dto';

/*
 * PartialType convierte todos los campos de CreateCustomerDto en opcionales.
 * Esto permite actualizar solo los campos enviados.
 */
export class UpdateCustomerDto extends PartialType(CreateCustomerDto) {}
