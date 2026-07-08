import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ChecklistStatus } from '@prisma/client';

export class CreateChecklistItemDto {
  /*
   * Nombre del punto a revisar.
   * Ejemplo: "Nivel de aceite", "Luces delanteras", "Frenos".
   */
  @IsString()
  item!: string;

  /*
   * Estado del punto inspeccionado.
   */
  @IsOptional()
  @IsEnum(ChecklistStatus)
  status?: ChecklistStatus;

  /*
   * Observación técnica del mecánico.
   */
  @IsOptional()
  @IsString()
  notes?: string;
}
