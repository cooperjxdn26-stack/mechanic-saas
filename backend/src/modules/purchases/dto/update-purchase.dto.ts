import { PartialType } from '@nestjs/mapped-types';
import { CreatePurchaseDto } from './create-purchase.dto';

/*
 * Para actualizar compra.
 * Por simplicidad permitimos actualizar campos generales.
 */
export class UpdatePurchaseDto extends PartialType(CreatePurchaseDto) {}
