import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class OpenCashRegisterDto {
  /*
   * Monto inicial con el que se abre caja.
   */
  @IsNumber()
  @Min(0)
  openingAmount!: number;

  @IsOptional()
  @IsString()
  notes?: string;

  /*
   * Sucursal de la caja.
   */
  @IsOptional()
  @IsString()
  branchId?: string;
}
