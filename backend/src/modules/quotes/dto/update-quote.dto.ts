import { PartialType } from '@nestjs/mapped-types';
import { CreateQuoteDto } from './create-quote.dto';

/*
 * Permite actualizar parcialmente una cotización.
 * Importante: si la cotización ya fue aprobada o convertida,
 * limitaremos cambios desde el servicio.
 */
export class UpdateQuoteDto extends PartialType(CreateQuoteDto) {}
