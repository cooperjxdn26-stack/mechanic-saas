import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CloseCashRegisterDto {
  /*
   * Monto físico contado al cierre.
   */
  @IsNumber()
  @Min(0)
  closingAmount!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
