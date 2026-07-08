import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateInvoiceDto {
  /*
   * Cliente al que se emite la factura.
   */
  @IsString()
  customerId!: string;

  /*
   * Cotización aprobada desde la que se genera factura.
   */
  @IsOptional()
  @IsString()
  quoteId?: string;

  /*
   * Orden de trabajo asociada.
   */
  @IsOptional()
  @IsString()
  workOrderId?: string;

  /*
   * Si no hay cotización, se pueden enviar montos manuales.
   */
  @IsOptional()
  @IsNumber()
  @Min(0)
  subtotal?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  tax?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total?: number;

  /*
   * URL del PDF generado.
   * Más adelante se llenará desde el módulo de reportes.
   */
  @IsOptional()
  @IsString()
  pdfUrl?: string;
}
