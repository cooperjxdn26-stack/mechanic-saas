import { IsDateString, IsOptional, IsString } from 'class-validator';

export class ReportQueryDto {
  /*
   * Fecha inicial del reporte.
   */
  @IsOptional()
  @IsDateString()
  from?: string;

  /*
   * Fecha final del reporte.
   */
  @IsOptional()
  @IsDateString()
  to?: string;

  /*
   * Sucursal opcional.
   */
  @IsOptional()
  @IsString()
  branchId?: string;

  /*
   * Empresa opcional.
   */
  @IsOptional()
  @IsString()
  companyId?: string;
}
