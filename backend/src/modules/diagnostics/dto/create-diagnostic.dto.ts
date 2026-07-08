import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { DiagnosticType } from '@prisma/client';

export class CreateDiagnosticDto {
  /*
   * Tipo de diagnóstico:
   * INITIAL, TECHNICAL, FINAL, AI_SUGGESTED.
   */
  @IsOptional()
  @IsEnum(DiagnosticType)
  type?: DiagnosticType;

  /*
   * Título breve del diagnóstico.
   */
  @IsString()
  title!: string;

  /*
   * Descripción técnica detallada.
   */
  @IsString()
  description!: string;

  /*
   * Campo preparado para sugerencias generadas por IA.
   */
  @IsOptional()
  @IsString()
  aiSuggestion?: string;

  /*
   * Confianza de la sugerencia IA o del diagnóstico.
   * Valor de 0 a 100.
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  confidence?: number;

  /*
   * Solución propuesta o realizada.
   */
  @IsOptional()
  @IsString()
  solution?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  /*
   * Orden de trabajo relacionada.
   */
  @IsString()
  workOrderId!: string;

  /*
   * Mecánico que registra el diagnóstico.
   * Si no se envía, se tomará del usuario autenticado.
   */
  @IsOptional()
  @IsString()
  mechanicId?: string;
}
