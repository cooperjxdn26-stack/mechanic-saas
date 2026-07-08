import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { ServiceCategory } from '@prisma/client';

export class CreateServiceDto {
  /*
   * Nombre del servicio.
   * Ejemplo: Cambio de aceite, Afinamiento general, Diagnóstico computarizado.
   */
  @IsString()
  name!: string;

  /*
   * Descripción comercial o técnica del servicio.
   */
  @IsOptional()
  @IsString()
  description?: string;

  /*
   * Categoría del servicio.
   */
  @IsOptional()
  @IsEnum(ServiceCategory)
  category?: ServiceCategory;

  /*
   * Precio base del servicio.
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  basePrice?: number;

  /*
   * Tiempo estimado en minutos.
   * Sirve luego para agenda y productividad.
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  estimatedTimeMinutes?: number;

  /*
   * Permite ocultar servicios sin eliminarlos.
   */
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  /*
   * Empresa dueña del servicio.
   */
  @IsOptional()
  @IsString()
  companyId?: string;
}
