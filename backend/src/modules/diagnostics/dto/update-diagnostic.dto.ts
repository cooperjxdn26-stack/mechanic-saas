import { PartialType } from '@nestjs/mapped-types';
import { CreateDiagnosticDto } from './create-diagnostic.dto';

/*
 * Permite actualizar parcialmente un diagnóstico.
 */
export class UpdateDiagnosticDto extends PartialType(CreateDiagnosticDto) {}
