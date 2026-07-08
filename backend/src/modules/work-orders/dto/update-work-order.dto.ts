import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkOrderDto } from './create-work-order.dto';

/*
 * Permite actualizar parcialmente una orden.
 */
export class UpdateWorkOrderDto extends PartialType(CreateWorkOrderDto) {}
