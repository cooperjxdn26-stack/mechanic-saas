import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

export class CreatePaymentDto {
  /*
   * Método de pago:
   * CASH, CARD, TRANSFER, YAPE, PLIN, POS, CREDIT, OTHER.
   */
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  /*
   * Estado del pago.
   * Normalmente PAID.
   */
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  /*
   * Monto pagado.
   */
  @IsNumber()
  @Min(0.01)
  amount!: number;

  /*
   * Código de operación, voucher o referencia.
   */
  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  customerId?: string;

  /*
   * Factura que se está pagando.
   */
  @IsOptional()
  @IsString()
  invoiceId?: string;

  /*
   * Caja donde entra el dinero.
   */
  @IsOptional()
  @IsString()
  cashRegisterId?: string;
}
