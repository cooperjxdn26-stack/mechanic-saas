import { PartialType } from '@nestjs/mapped-types';
import { CreateSupplierDto } from './create-supplier.dto';

/*
 * Actualización parcial.
 */
export class UpdateSupplierDto extends PartialType(CreateSupplierDto) {}
