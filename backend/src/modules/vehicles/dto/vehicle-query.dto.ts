import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class VehicleQueryDto {
  /*
   * Búsqueda general:
   * placa, marca, modelo o VIN.
   */
  @IsOptional()
  @IsString()
  search?: string;

  /*
   * Filtrar vehículos por cliente.
   */
  @IsOptional()
  @IsString()
  customerId?: string;

  /*
   * Filtrar por sucursal.
   */
  @IsOptional()
  @IsString()
  branchId?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
