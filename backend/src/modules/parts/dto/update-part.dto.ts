import { PartialType } from '@nestjs/mapped-types';
import { CreatePartDto } from './create-part.dto';

/*
 * Actualización parcial del repuesto.
 */
export class UpdatePartDto extends PartialType(CreatePartDto) {}
