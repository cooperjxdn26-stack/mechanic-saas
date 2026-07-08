import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';

/*
 * Permite actualizar solo los campos enviados.
 */
export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
