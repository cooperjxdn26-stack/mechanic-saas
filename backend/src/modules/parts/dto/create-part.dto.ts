import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePartDto {
  /*
   * Nombre comercial del repuesto.
   */
  @IsString()
  name!: string;

  /*
   * Código interno o de fabricante.
   */
  @IsOptional()
  @IsString()
  code?: string;

  /*
   * SKU único para control de inventario.
   */
  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  description?: string;

  /*
   * Stock inicial.
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  /*
   * Stock mínimo.
   * Cuando stock <= minStock, se genera alerta en frontend.
   */
  @IsOptional()
  @IsInt()
  @Min(0)
  minStock?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  purchasePrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  salePrice?: number;

  /*
   * Ubicación física en almacén.
   * Ejemplo: Pasillo A, Estante 3.
   */
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  supplierId?: string;
}
