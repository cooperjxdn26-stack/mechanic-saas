import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentQueryDto } from './dto/payment-query.dto';

import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserPayload } from '../../common/decorators/current-user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /*
   * Registrar pago.
   * Se registra el usuario autenticado como quien recibió el pago.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER')
  @Post()
  create(
    @Body() dto: CreatePaymentDto,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.paymentsService.create(dto, user.id);
  }

  /*
   * Listar pagos.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER')
  @Get()
  findAll(@Query() query: PaymentQueryDto) {
    return this.paymentsService.findAll(query);
  }

  /*
   * Resumen de pagos.
   * Debe ir antes de /:id para evitar conflicto con rutas dinámicas.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER')
  @Get('summary')
  getSummary(@Query('from') from?: string, @Query('to') to?: string) {
    return this.paymentsService.getSummary(from, to);
  }

  /*
   * Detalle de pago.
   */
  @Roles('SUPER_ADMIN', 'ADMIN', 'CASHIER')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }
}
